const fs = require('fs');
const path = require('path');

function getCacheFilePath(campaignKey = 'default') {
  return path.join(__dirname, '..', 'data', `deals_cache_${campaignKey}.json`);
}

function ensureDataDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadCache(campaignKey = 'default') {
  const filePath = getCacheFilePath(campaignKey);
  ensureDataDir(filePath);
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn(`[DealTracker] Could not load cache for ${campaignKey}, starting fresh:`, e.message);
  }
  return {
    lastDate: null,
    lastRunId: null,
    lastRunHour: null,
    lastCycleId: null,
    items: {},
    lastRuns: {}
  };
}

function saveCache(cache, campaignKey = 'default') {
  const filePath = getCacheFilePath(campaignKey);
  ensureDataDir(filePath);
  try {
    fs.writeFileSync(filePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {
    console.error(`[DealTracker] Error saving cache for ${campaignKey}:`, e.message);
  }
}

/**
 * All campaign workers share one product history. On first use, merge the
 * existing per-campaign caches so previously alerted products stay suppressed.
 */
function loadSharedCache() {
  const cache = loadCache('global');
  if (cache.sharedMigrationComplete) return cache;

  const dataDir = path.dirname(getCacheFilePath('global'));
  ensureDataDir(getCacheFilePath('global'));
  const legacyFiles = fs.readdirSync(dataDir)
    .filter((file) => /^deals_cache_(?!global\\.json$).+\\.json$/.test(file));

  let importedItems = 0;
  for (const file of legacyFiles) {
    try {
      const legacy = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      for (const [itemKey, item] of Object.entries(legacy.items || {})) {
        if (!item || typeof item !== 'object') continue;
        const existing = cache.items[itemKey];
        const itemAlertTime = Number(item.lastAlertedTimestamp)
          || (item.lastAlertedDate ? new Date(item.lastAlertedDate).getTime() : 0);
        const existingAlertTime = existing
          ? Number(existing.lastAlertedTimestamp)
            || (existing.lastAlertedDate ? new Date(existing.lastAlertedDate).getTime() : 0)
          : -1;

        // Prefer the most recent alert record; retain a prior alert price even
        // when a later campaign only observed the product without alerting it.
        if (!existing || itemAlertTime > existingAlertTime) {
          cache.items[itemKey] = { ...item };
          importedItems++;
        } else if (existing && item.lastSeen && (!existing.lastSeen || item.lastSeen > existing.lastSeen)) {
          existing.lastSeen = item.lastSeen;
          existing.lastSeenRunId = item.lastSeenRunId || existing.lastSeenRunId;
        }
      }
    } catch (error) {
      console.warn(`[DealTracker] Could not migrate legacy cache ${file}:`, error.message);
    }
  }

  cache.sharedMigrationComplete = true;
  cache.sharedMigrationAt = Date.now();
  console.log(`[DealTracker] Shared cache migration complete. Imported/updated ${importedItems} product records from ${legacyFiles.length} legacy campaign caches.`);
  saveCache(cache, 'global');
  return cache;
}

function getIstWeekStart(istDate, resetDay = 1) {
  const day = istDate.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffDays = (day - resetDay + 7) % 7;
  const start = new Date(istDate.getTime() - diffDays * 24 * 60 * 60 * 1000);
  return start.toISOString().slice(0, 10);
}

function getIstContext(overrideDate = null, overrideHour = null, refreshCycle = 'daily', resetDay = 1) {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  let istDate;
  if (overrideDate) {
    const h = overrideHour !== null ? String(overrideHour).padStart(2, '0') : '00';
    istDate = new Date(`${overrideDate}T${h}:00:00.000Z`);
  } else {
    istDate = new Date(now.getTime() + istOffset);
  }
  const dateStr = overrideDate || istDate.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const hour = overrideHour !== null ? overrideHour : istDate.getUTCHours(); // 0 to 23
  const minuteSlot = istDate.getUTCMinutes() < 30 ? '00' : '30';
  const runId = `${dateStr}-${hour}:${minuteSlot}`;

  const dailyCycleId = `D-${dateStr}`;
  const weekStartStr = getIstWeekStart(istDate, resetDay);
  const weeklyCycleId = `W-${weekStartStr}`;
  const cycleId = refreshCycle === 'weekly' ? weeklyCycleId : dailyCycleId;

  return { dateStr, hour, runId, cycleId, dailyCycleId, weeklyCycleId, now: now.getTime() };
}

function normalizeProductName(name) {
  if (!name) return '';
  let str = name.trim().toLowerCase();

  // 1. Remove parenthetical descriptions, e.g. (XL, Sky Blue), (Pack of 2), (Freshly made), (Red or Green, ...)
  str = str.replace(/\([^)]*\)/g, ' ');

  // 2. Remove shoe size suffixes like "- 5 uk", "- uk 7", ", 8 uk", "uk 10", "5 uk", "- 6 uk", "uk 6"
  str = str.replace(/[-\s,]+(?:uk\s*\d+|\d+\s*uk)\b/gi, ' ');

  // 3. Remove standalone clothing size tags like "- xl", "- l", "size m", "xl", "xxl", "xxxl"
  str = str.replace(/[-\s,]+(?:xs|s|m|l|xl|xxl|xxxl)\b/gi, ' ');

  // 4. Remove wattage and piece count suffixes e.g. "9w,65k,1piece", "12w,65k,1 piece", "12 w"
  str = str.replace(/\b\d+\s*w\b/gi, ' ');
  str = str.replace(/\b\d+\s*piece(?:s)?\b/gi, ' ');
  str = str.replace(/\b\d+k\b/gi, ' ');

  // 5. Clean up multiple spaces, commas, dashes
  str = str.replace(/[-_,\s]+/g, ' ').trim();

  return str;
}

function getCanonicalItemKey(item) {
  if (item.parentProductId) {
    return `pid:${item.parentProductId}`;
  }
  const norm = normalizeProductName(item.name);
  if (norm) {
    return `name:${norm}`;
  }
  return (item.name || '').trim().toLowerCase() || String(item.skuId || '');
}

function isStaticCooldownCandidate(item) {
  const cat = (item.category || '').toLowerCase();
  const sub = (item.subCategory || '').toLowerCase();
  const name = (item.name || '').toLowerCase();

  // 1. Decor items in Home & Kitchen or anywhere
  if (sub.includes('decor') || name.includes('decor') || name.includes('string light') || name.includes('fairy light') || name.includes('diya') || name.includes('candle') || name.includes('lamp')) {
    return true;
  }

  // 2. Electronics: Cables, Chargers, Batteries, Extensions, Lights
  if (sub.includes('cable') || sub.includes('charger') || sub.includes('battery') || sub.includes('light') || sub.includes('bulb')) {
    return true;
  }
  if (name.includes('cable') || name.includes('charging') || name.includes('cord') || name.includes('adapter')) {
    return true;
  }

  // 3. Smartwatches
  if (sub.includes('smartwatch') || name.includes('smartwatch') || name.includes('smart watch')) {
    return true;
  }

  // 4. Inflated-MRP Brands: Dubstep, Hammer, boAt, Noise
  if (/\b(dubstep|hammer|boat|bo-at|noise)\b/i.test(name)) {
    return true;
  }

  return false;
}

/**
 * Evaluates a list of fetched items against the minimum discount threshold.
 * 
 * Deal Suppression Logic:
 * 1. First qualifying sighting:
 *    - A product that has never been alerted is sent once when it meets its discount threshold.
 * 2. Continuous price-based suppression (across days and weekly cycles):
 *    - Once alerted, a product stays suppressed indefinitely while its price is equal to or
 *      higher than its last alerted price. Daily/weekly cycle resets never resend it unchanged.
 *    - A product is re-alerted only when its actual selling price drops below its last
 *      alerted price. MRP/discount-percentage fluctuations alone do not trigger alerts.
 *    - Out-of-stock or below-threshold periods do not clear the last alerted price.
 * 3. Existing 15-day static-product cooldown remains an additional safeguard.
 */
function findAlertWorthyDeals(items, minDiscount = 70, campaignKey = 'default', options = {}) {
  const cache = loadSharedCache();
  const alertList = [];
  const refreshCycle = options.refreshCycle || 'daily';
  const resetDay = options.weeklyResetDay !== undefined ? options.weeklyResetDay : 1;
  const weeklyCategories = options.weeklyCategories || [];
  const { dateStr, hour, runId, cycleId, dailyCycleId, weeklyCycleId, now } = getIstContext(
    options.overrideDate,
    options.overrideHour,
    refreshCycle,
    resetDay
  );

  // Daily cycle first run: date change or morning kickoff run (09:00 AM or 10:00 AM IST)
  const isDailyFirstRun = (cache.lastDailyCycleId !== dailyCycleId)
    || (!cache.lastDailyCycleId && cache.lastDate !== dateStr)
    || ((hour === 9 || hour === 10) && (cache.lastRunHour === null || cache.lastRunHour < 9));

  // Weekly cycle first run: weekly cycle ID rollover on resetDay
  const isWeeklyFirstRun = (cache.lastWeeklyCycleId !== weeklyCycleId)
    || (!cache.lastWeeklyCycleId && cache.lastCycleId !== cycleId && refreshCycle === 'weekly');

  const lastRunId = cache.lastRunId;
  const seenInCurrentRun = new Map();

  for (const item of items) {
    let threshold = 70;
    if (item.minDiscount !== undefined && item.minDiscount !== null) {
      threshold = item.minDiscount;
    } else if (item.threshold !== undefined && item.threshold !== null) {
      threshold = item.threshold;
    } else if (options.categoryThresholds && options.categoryThresholds[item.category]) {
      threshold = options.categoryThresholds[item.category];
    } else if (typeof minDiscount === 'object' && minDiscount !== null) {
      threshold = item.dealType === 'essential'
        ? (minDiscount.essentials || 70)
        : (minDiscount.nonEssentials || 70);
    } else if (typeof minDiscount === 'number') {
      threshold = minDiscount;
    }

    if (item.discount < threshold) continue;

    const itemKey = getCanonicalItemKey(item);
    if (!itemKey) continue;

    // Intra-run deduplication: if multiple variants/sizes of the same product exist in this batch
    if (seenInCurrentRun.has(itemKey)) {
      const existingAlert = seenInCurrentRun.get(itemKey);
      if (item.price < existingAlert.price) {
        // Update alert with the cheaper variant
        existingAlert.price = item.price;
        existingAlert.mrp = item.mrp;
        existingAlert.discount = item.discount;
        existingAlert.name = item.name;
        existingAlert.searchLink = item.searchLink;
        if (cache.items[itemKey]) {
          cache.items[itemKey].price = item.price;
          cache.items[itemKey].discount = item.discount;
          if (existingAlert.alertType) {
            cache.items[itemKey].lastAlertedPrice = item.price;
            cache.items[itemKey].lastAlertedDiscount = item.discount;
          }
        }
      }
      continue;
    }

    // Determine cycle for this specific item:
    // If weeklyCategories includes item.category, or if campaign-level refreshCycle is weekly
    const isItemWeekly = (weeklyCategories && weeklyCategories.includes(item.category))
      || (refreshCycle === 'weekly');
    const itemCycle = isItemWeekly ? 'weekly' : 'daily';
    const itemCycleId = isItemWeekly ? weeklyCycleId : dailyCycleId;
    const isFirstRunOfItemCycle = isItemWeekly ? isWeeklyFirstRun : isDailyFirstRun;

    const prev = cache.items[itemKey];
    const prevAlertedDisc = prev ? (prev.lastAlertedDiscount !== undefined ? prev.lastAlertedDiscount : prev.discount) : null;
    const prevAlertedPrice = prev ? (prev.lastAlertedPrice !== undefined ? prev.lastAlertedPrice : prev.price) : null;

    // Suppression is continuous across calendar days and weekly cycles.
    // Only a genuinely lower selling price can re-alert an already-alerted product.
    // Changes to MRP/discount percentage alone must not generate repeat notifications.
    const hasPreviousAlert = prev && prevAlertedPrice !== null;
    const isActualPriceImprovement = hasPreviousAlert && Number(item.price) < Number(prevAlertedPrice);

    let shouldAlert = !prev || !hasPreviousAlert;
    let alertType = 'NEW_DEAL';

    if (hasPreviousAlert) {
      shouldAlert = isActualPriceImprovement;
      if (shouldAlert) {
        alertType = 'PRICE_DROP';
      }
    }

    // Keep the static-product cooldown as a defensive safeguard.
    // A real price improvement is allowed through; unchanged/higher prices are already suppressed.
    const isCooldownCandidate = isStaticCooldownCandidate(item);
    if (shouldAlert && isCooldownCandidate && prev && prev.lastAlertedPrice !== undefined && prev.lastAlertedPrice !== null) {
      const isPriceSameOrHigher = Number(item.price) >= Number(prev.lastAlertedPrice);
      const lastAlertTime = prev.lastAlertedTimestamp || (prev.lastAlertedDate ? new Date(prev.lastAlertedDate).getTime() : 0);
      const daysSinceAlert = (now - lastAlertTime) / (24 * 60 * 60 * 1000);

      if (isPriceSameOrHigher && daysSinceAlert < 15) {
        shouldAlert = false;
      }
    }

    if (shouldAlert) {
      const alertObj = {
        ...item,
        alertType,
        prevPrice: prev ? (prev.lastAlertedPrice !== undefined ? prev.lastAlertedPrice : prev.price) : null,
        prevDiscount: prev ? (prev.lastAlertedDiscount !== undefined ? prev.lastAlertedDiscount : prev.discount) : null,
        campaignKey,
        dealType: item.dealType || campaignKey,
        searchQuery: item.searchQuery || ''
      };
      alertList.push(alertObj);
      seenInCurrentRun.set(itemKey, alertObj);

      cache.items[itemKey] = {
        name: item.name,
        category: item.category || '',
        skuId: item.skuId || null,
        parentProductId: item.parentProductId || null,
        price: item.price,
        mrp: item.mrp,
        discount: item.discount,
        lastAlertedPrice: item.price,
        lastAlertedDiscount: item.discount,
        lastAlertedDate: dateStr,
        lastAlertedTimestamp: now,
        lastAlertedHour: hour,
        lastAlertedCycle: itemCycleId,
        lastSeenRunId: runId,
        firstSeen: prev ? prev.firstSeen : now,
        lastSeen: now
      };
    } else {
      // Keep tracking presence in cache without triggering Telegram alert
      seenInCurrentRun.set(itemKey, { price: item.price });
      if (!cache.items[itemKey]) {
        cache.items[itemKey] = {
          name: item.name,
          category: item.category || '',
          skuId: item.skuId || null,
          parentProductId: item.parentProductId || null,
          price: item.price,
          mrp: item.mrp,
          discount: item.discount,
          lastAlertedPrice: null,
          lastAlertedDiscount: null,
          lastAlertedDate: null,
          lastAlertedHour: null,
          lastAlertedCycle: null,
          lastSeenRunId: runId,
          firstSeen: now,
          lastSeen: now
        };
      } else {
        cache.items[itemKey].lastSeenRunId = runId;
        cache.items[itemKey].price = item.price;
        cache.items[itemKey].discount = item.discount;
        cache.items[itemKey].lastSeen = now;
      }
    }
  }

  // Sort deals descending by discount percentage (highest discount first)
  alertList.sort((a, b) => b.discount - a.discount);

  const totalMetCriteria = items.filter(it => it.discount >= (typeof minDiscount === 'number' ? minDiscount : 70)).length;
  const suppressedCount = Math.max(0, totalMetCriteria - alertList.length);
  console.log(`[DealTracker:${campaignKey}] Total Scanned: ${items.length} | Meets Criteria: ${totalMetCriteria} | Alerts Sent: ${alertList.length} | Suppressed Duplicates: ${suppressedCount} (Cycle: ${refreshCycle}/${cycleId})`);

  // Update run metadata
  cache.lastDate = dateStr;
  cache.lastRunHour = hour;
  cache.lastRunId = runId;
  cache.lastCycleId = cycleId;
  cache.lastDailyCycleId = dailyCycleId;
  cache.lastWeeklyCycleId = weeklyCycleId;
  cache.lastRuns[runId] = {
    timestamp: now,
    cycleId,
    refreshCycle,
    totalItems: items.length,
    alertsFound: alertList.length,
    suppressedCount
  };

  saveCache(cache, 'global');
  return alertList;
}

function getCachedDeals(campaignKey = 'default', minDiscount = 0) {
  const cache = loadSharedCache();
  const result = [];
  for (const [key, val] of Object.entries(cache.items || {})) {
    if (val.discount >= minDiscount) {
      result.push(val);
    }
  }
  result.sort((a, b) => b.discount - a.discount);
  return result;
}

module.exports = {
  loadCache,
  saveCache,
  findAlertWorthyDeals,
  getCachedDeals,
  getIstContext
};
