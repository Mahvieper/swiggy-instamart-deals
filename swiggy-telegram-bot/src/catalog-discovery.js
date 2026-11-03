'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const puppeteer = require('puppeteer-core');
const config = require('../config.json');

const OUTPUT_FILE = path.join(__dirname, '..', 'discovered-catalog.json');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findBrowserExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const candidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/google/chrome/chrome',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function getSeedCategories() {
  const categories = new Map();
  for (const campaign of Object.values(config.campaigns || {})) {
    for (const item of campaign.subcategories || []) {
      if (!item.category || !item.taxonomyType) continue;
      const key = item.category.trim() + '||' + item.taxonomyType.trim();
      if (!categories.has(key)) {
        categories.set(key, {
          name: item.category.trim(),
          taxonomyType: item.taxonomyType.trim()
        });
      }
    }
  }
  return Array.from(categories.values());
}

function getCampaignMap() {
  const map = new Map();
  for (const [campaignKey, campaign] of Object.entries(config.campaigns || {})) {
    if (campaign.enabled === false) continue;
    for (const item of campaign.subcategories || []) {
      if (!item.category) continue;
      const key = item.category.trim().toLowerCase();
      if (!map.has(key)) map.set(key, []);
      if (!map.get(key).includes(campaignKey)) map.get(key).push(campaignKey);
    }
  }
  return map;
}

function inferCampaigns(category, subcategory, categoryMap) {
  const exact = categoryMap.get(String(category || '').trim().toLowerCase());
  if (exact && exact.length) return exact.slice();

  const value = (String(category || '') + ' ' + String(subcategory || '')).toLowerCase();
  const rules = [
    ['fresh', /\b(vegetable|fruit|dairy|bread|egg|meat|seafood|chicken|mutton|fish|paneer|tofu|produce)\b/],
    ['grocery', /\b(atta|rice|dal|pulse|oil|ghee|masala|spice|staple|flour|besan|salt)\b/],
    ['treats', /\b(chocolate|ice.?cream|sweet|mithai|cake|biscuit|cookie|bakery|dessert)\b/],
    ['munchies', /\b(chip|snack|namkeen|noodle|pasta|frozen|ready.?to.?eat|munch|popcorn)\b/],
    ['beverages', /\b(drink|juice|beverage|tea|coffee|cereal|spread|sauce|health|pharma|nutrition)\b/],
    ['personalCare', /\b(bath|body|hair|skin|hygiene|makeup|feminine|oral.?care|personal)\b/],
    ['lifestyle', /\b(baby|toy|stationery|fashion|electronic|appliance|home|kitchen)\b/],
    ['household', /\b(clean|repellent|home|kitchen|electronic|appliance)\b/],
    ['clearance', /\b(fashion|toy|baby|makeup|sexual.?wellness|clearance)\b/]
  ];
  for (const rule of rules) {
    if (rule[1].test(value)) return [rule[0]];
  }
  return ['discovered'];
}

function buildCampaignCatalog(subcategories) {
  const categoryMap = getCampaignMap();
  const campaigns = {};
  for (const item of subcategories) {
    const keys = inferCampaigns(item.category, item.name, categoryMap);
    item.campaigns = keys;
    for (const key of keys) {
      if (!campaigns[key]) campaigns[key] = [];
      campaigns[key].push(item);
    }
  }
  for (const key of Object.keys(campaigns)) {
    const byId = new Map();
    for (const item of campaigns[key]) {
      const existing = byId.get(item.id);
      if (!existing) byId.set(item.id, item);
    }
    campaigns[key] = Array.from(byId.values());
  }
  return campaigns;
}

async function discoverInBrowser(storeConfig, seedCategories) {
  const executablePath = findBrowserExecutable();
  if (!executablePath) {
    throw new Error('Chrome/Chromium was not found. Set PUPPETEER_EXECUTABLE_PATH or install Chrome.');
  }

  const profile = path.join(os.tmpdir(), 'instamart-catalog-' + process.pid + '-' + Date.now());
  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    userDataDir: profile,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    ]
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(45000);

    // Use the optional session cookie supplied by GitHub Actions. Store it only
    // for the Instamart origin rather than attaching it to every outbound request.
    const cookieHeader = process.env.SWIGGY_COOKIE || '';
    if (cookieHeader.trim()) {
      const cookies = cookieHeader.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
        const separator = part.indexOf('=');
        if (separator <= 0) return null;
        return {
          name: part.slice(0, separator).trim(),
          value: part.slice(separator + 1).trim(),
          url: 'https://instamart.in/',
          secure: true
        };
      }).filter(Boolean);
      if (cookies.length) await browser.defaultBrowserContext().setCookie(...cookies);
    }

    // Capture catalog/navigation JSON fetched by the live storefront. This can
    // reveal newly introduced top-level categories beyond the current config seeds.
    const pendingResponses = [];
    const networkCategories = new Map();
    page.on('response', (response) => {
      const responseUrl = response.url();
      if (!responseUrl.includes('/api/instamart/')) return;
      const task = (async () => {
        try {
          const headers = response.headers();
          if (!(headers['content-type'] || '').includes('json')) return;
          const payload = await response.json();
          const visited = new WeakSet();
          const walk = (node, depth = 0) => {
            if (!node || typeof node !== 'object' || depth > 16 || visited.has(node)) return;
            visited.add(node);
            if (Array.isArray(node)) {
              for (const child of node) walk(child, depth + 1);
              return;
            }
            if (node.categoryName && node.taxonomyType) {
              const name = String(node.categoryName).trim();
              const taxonomyType = String(node.taxonomyType).trim();
              if (name && taxonomyType) networkCategories.set(name.toLowerCase() + '||' + taxonomyType.toLowerCase(), { name, taxonomyType });
            }
            for (const field of ['deepLink', 'url', 'link']) {
              const value = node[field];
              if (typeof value === 'string') {
                try {
                  const parsed = new URL(value, 'https://instamart.in');
                  const name = parsed.searchParams.get('categoryName');
                  const taxonomyType = parsed.searchParams.get('taxonomyType');
                  if (name && taxonomyType) networkCategories.set(name.toLowerCase() + '||' + taxonomyType.toLowerCase(), { name, taxonomyType });
                } catch (error) {}
              }
            }
            for (const child of Object.values(node)) walk(child, depth + 1);
          };
          walk(payload);
        } catch (error) {}
      })();
      pendingResponses.push(task);
    });

    await page.goto('https://instamart.in', { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
    await sleep(6000);

    // Instamart lazy-loads some navigation and category metadata as the page is
    // scrolled. A bounded sweep triggers those requests without clicking or
    // changing the selected store/category.
    for (let step = 0; step < 12; step++) {
      await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.8, 600)));
      await sleep(450);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(1200);
    await Promise.allSettled(pendingResponses);

    return await page.evaluate(async function (input) {
      const sid = input.sid;
      const pid = input.pid || input.sid;
      const secid = input.secid || '';
      const candidates = new Map();
      const subcategories = new Map();
      const failures = [];

      function addCategory(name, taxonomyType) {
        if (!name || !taxonomyType) return;
        const cleanName = String(name).trim();
        const cleanType = String(taxonomyType).trim();
        if (!cleanName || !cleanType) return;
        candidates.set(cleanName.toLowerCase() + '||' + cleanType.toLowerCase(), {
          name: cleanName,
          taxonomyType: cleanType
        });
      }

      function readCategoryUrl(value) {
        if (!value || typeof value !== 'string') return;
        try {
          const url = new URL(value, window.location.origin);
          const name = url.searchParams.get('categoryName');
          const taxonomy = url.searchParams.get('taxonomyType');
          if (name && taxonomy) addCategory(name, taxonomy);
        } catch (e) {
          const nameMatch = value.match(/[?&]categoryName=([^&]+)/i);
          const typeMatch = value.match(/[?&]taxonomyType=([^&]+)/i);
          if (nameMatch && typeMatch) {
            try {
              addCategory(decodeURIComponent(nameMatch[1]), decodeURIComponent(typeMatch[1]));
            } catch (err) {}
          }
        }
      }

      function extractFilterId(value) {
        if (!value) return '';
        const text = String(value);
        try {
          const url = new URL(text, window.location.origin);
          return url.searchParams.get('filterId') || '';
        } catch (e) {
          const match = text.match(/[?&]filterId=([^&]+)/i);
          if (!match) return '';
          try { return decodeURIComponent(match[1]); } catch (err) { return match[1]; }
        }
      }

      // Read category deep links exposed by the rendered Instamart navigation.
      for (const anchor of Array.from(document.querySelectorAll('a[href]'))) {
        readCategoryUrl(anchor.href);
        readCategoryUrl(anchor.getAttribute('href'));
      }

      // Some app builds keep navigation metadata in serialized page state.
      const roots = [
        window.__INITIAL_STATE__,
        window.__PRELOADED_STATE__,
        window.__NEXT_DATA__,
        window.__APOLLO_STATE__
      ];
      const seen = new WeakSet();
      function walkState(node, depth) {
        if (!node || typeof node !== 'object' || depth > 18 || seen.has(node)) return;
        seen.add(node);
        if (Array.isArray(node)) {
          for (const value of node) walkState(value, depth + 1);
          return;
        }
        if (node.categoryName && node.taxonomyType) {
          addCategory(node.categoryName, node.taxonomyType);
        }
        if (node.deepLink) readCategoryUrl(node.deepLink);
        if (node.url) readCategoryUrl(node.url);
        for (const value of Object.values(node)) walkState(value, depth + 1);
      }
      for (const root of roots) walkState(root, 0);

      for (const script of Array.from(document.querySelectorAll('script[type="application/json"], script#__NEXT_DATA__'))) {
        try { walkState(JSON.parse(script.textContent || '{}'), 0); } catch (e) {}
      }

      for (const seed of input.seeds || []) addCategory(seed.name, seed.taxonomyType);
      for (const discovered of input.networkCategories || []) addCategory(discovered.name, discovered.taxonomyType);

      const categoryList = Array.from(candidates.values());
      const makeMatcher = function () {
        const raw = String(Math.floor(10000 + Math.random() * 90000)) + Date.now().toString() +
          String(Math.floor(10000 + Math.random() * 90000));
        return raw.split('').map(function (digit) {
          return (parseInt(digit, 10) + 7).toString(36);
        }).join('');
      };
      const pause = function (ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); };

      function collectTabs(node, output, visited) {
        if (!node || typeof node !== 'object' || visited.has(node)) return;
        visited.add(node);
        if (Array.isArray(node)) {
          for (const value of node) collectTabs(value, output, visited);
          return;
        }
        if (Array.isArray(node.navigationTabs)) {
          for (const tab of node.navigationTabs) {
            const name = tab && (tab.name || tab.title || tab.displayName);
            const deepLink = tab && (tab.deepLink || tab.url || tab.link);
            const id = (tab && (tab.filterId || tab.id)) || extractFilterId(deepLink);
            if (name && id) output.push({ name: String(name).trim(), id: String(id), deepLink: deepLink || '' });
          }
        }
        for (const value of Object.values(node)) collectTabs(value, output, visited);
      }

      let successfulCategories = 0;
      const categoriesWithSubcategories = [];
      const categoriesWithoutSubcategories = [];
      for (let index = 0; index < categoryList.length; index++) {
        const category = categoryList[index];
        const url = 'https://instamart.in/api/instamart/category-listing/v2?categoryName=' +
          encodeURIComponent(category.name) + '&taxonomyType=' + encodeURIComponent(category.taxonomyType) +
          '&offset=0&storeId=' + encodeURIComponent(sid) + '&primaryStoreId=' + encodeURIComponent(pid) +
          '&secondaryStoreId=' + encodeURIComponent(secid);

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: { accept: '*/*', 'content-type': 'application/json', matcher: makeMatcher() },
            credentials: 'include'
          });
          if (!response.ok) {
            failures.push({ category: category.name, status: response.status });
          } else {
            const json = await response.json();
            const tabs = [];
            collectTabs(json && json.data, tabs, new WeakSet());
            successfulCategories++;
            if (tabs.length) categoriesWithSubcategories.push({ category: category.name, count: tabs.length });
            else categoriesWithoutSubcategories.push(category.name);
            for (const tab of tabs) {
              const key = String(tab.id) + '||' + category.taxonomyType;
              const record = {
                category: category.name,
                name: tab.name,
                id: String(tab.id),
                taxonomyType: category.taxonomyType
              };
              const previous = subcategories.get(key);
              if (!previous) subcategories.set(key, record);
              else if (previous.name !== record.name || previous.category !== record.category) {
                previous.aliases = Array.from(new Set([...(previous.aliases || []), record.name, record.category]));
              }
            }
          }
        } catch (error) {
          failures.push({ category: category.name, error: String(error && error.message || error) });
        }
        await pause(180 + Math.floor(Math.random() * 120));
      }

      return {
        categories: categoryList,
        subcategories: Array.from(subcategories.values()),
        successfulCategories: successfulCategories,
        categoriesWithSubcategories: categoriesWithSubcategories,
        categoriesWithoutSubcategories: categoriesWithoutSubcategories,
        failedCategories: failures,
        attemptedCategories: categoryList.length
      };
    }, {
      sid: storeConfig.sid,
      pid: storeConfig.pid,
      secid: storeConfig.secid,
      seeds: seedCategories,
      networkCategories: Array.from(networkCategories.values())
    });
  } finally {
    await browser.close().catch(() => {});
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (error) {}
  }
}

async function main() {
  const storeConfig = {
    sid: process.env.SWIGGY_STORE_ID || (config.store && config.store.sid) || '',
    pid: process.env.SWIGGY_PRIMARY_STORE_ID || (config.store && config.store.pid) || '',
    secid: process.env.SWIGGY_SECONDARY_STORE_ID || (config.store && config.store.secid) || ''
  };
  if (!storeConfig.sid) throw new Error('SWIGGY_STORE_ID is required for store-specific catalog discovery.');

  const seeds = getSeedCategories();
  const curatedCount = Object.values(config.campaigns || {}).reduce(function (total, campaign) {
    return total + (campaign.subcategories || []).length;
  }, 0);

  console.log('[CatalogDiscovery] Starting store-specific discovery with ' + seeds.length + ' known category/taxonomy pairs.');
  const result = await discoverInBrowser(storeConfig, seeds);

  const minimumSuccessful = Math.max(3, Math.ceil(seeds.length * 0.4));
  const minimumSubcategories = Math.max(40, Math.ceil(curatedCount * 0.25));
  if (result.successfulCategories < minimumSuccessful || result.subcategories.length < minimumSubcategories) {
    throw new Error(
      'Catalog response looks incomplete; keeping the previous catalog. Successful categories: ' +
      result.successfulCategories + '/' + result.attemptedCategories +
      ', discovered subcategories: ' + result.subcategories.length +
      ', minimum expected: ' + minimumSubcategories + '.'
    );
  }

  const campaigns = buildCampaignCatalog(result.subcategories);
  const output = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    storeId: storeConfig.sid,
    source: 'Instamart category-listing/v2 navigationTabs',
    stats: {
      attemptedCategories: result.attemptedCategories,
      successfulCategories: result.successfulCategories,
      categoriesWithSubcategories: result.categoriesWithSubcategories.length,
      categoriesWithoutSubcategories: result.categoriesWithoutSubcategories.length,
      failedCategories: result.failedCategories.length,
      discoveredCategories: result.categories.length,
      discoveredSubcategories: result.subcategories.length,
      configuredSubcategories: curatedCount
    },
    categories: result.categories,
    subcategories: result.subcategories,
    campaigns: campaigns,
    categoriesWithSubcategories: result.categoriesWithSubcategories,
    categoriesWithoutSubcategories: result.categoriesWithoutSubcategories,
    failures: result.failedCategories
  };

  const temporaryFile = OUTPUT_FILE + '.tmp';
  fs.writeFileSync(temporaryFile, JSON.stringify(output, null, 2) + '\n', 'utf8');
  fs.renameSync(temporaryFile, OUTPUT_FILE);

  console.log('[CatalogDiscovery] Saved ' + result.subcategories.length + ' discovered subcategories across ' +
    Object.keys(campaigns).length + ' campaign buckets.');
  console.log('[CatalogDiscovery] Categories with subcategories: ' + result.categoriesWithSubcategories.length +
    '; categories with no navigation tabs: ' + result.categoriesWithoutSubcategories.length + '.');
  console.log('[CatalogDiscovery] Campaign counts: ' + Object.keys(campaigns).map(function (key) {
    return key + '=' + campaigns[key].length;
  }).join(', '));
}

main().catch(function (error) {
  console.error('[CatalogDiscovery] Failed:', error && error.stack || error);
  process.exit(1);
});
