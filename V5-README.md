# Deal Hunter V5 (development)

V5 is an independent rewrite and does not replace the stable V4 bookmarklet.

## Install the development bookmarklet

1. Open Swiggy Instamart in Chrome and make sure your delivery location has loaded.
2. Create a new bookmark named **Instamart Deal Hunter V5**.
3. Copy the entire one-line JavaScript from `swiggy-hunter-v5.bookmarklet.txt` into the bookmark URL.
4. While on `swiggy.com/instamart`, click the bookmark.

The loader currently points to this development branch. It is not a production release.

## Current implementation

- Uses store ID `1400978` as the default when the active store ID cannot be detected; a detected active store ID takes precedence.\n- Reuses the existing V4 aisle catalogue.
- Scans selected categories or all configured categories.
- Paginates through catalogue responses (up to 12 pages per aisle).
- Deduplicates products by SKU/product identity.
- Stores observed prices locally in the browser for up to 90 days of per-product points.
- Shows initial price-change, advertised-discount, and unit-price signals.
- Search, smart sorting, and CSV export.
- Sequential request pacing; stops on HTTP 403/429 rather than attempting to evade the restriction.

## Important limitations

- First scan is a baseline; price-change signals need repeated scans.
- Unit-price parsing currently supports common mass and volume pack descriptions. It does not yet normalize every count, bundle, or unusual product format.
- A low price is not automatically a genuine sale. Historical comparisons become more useful as observations accumulate.
- Catalogue completeness depends on Swiggy returning pagination offsets. The current per-aisle page cap is 12.
- This is a browser-session tool. Keep the Instamart tab open while scanning. No credentials are exported or stored by V5.
- The current UI is an initial foundation; competitor equivalence, bundle math, robust MRP anomaly detection, configurable watchlists, and Telegram integration are planned follow-up modules.

## Development safety

Test on the development branch first. V4 and the existing Telegram workflows are unchanged. Do not increase request concurrency or shorten pacing to work around Swiggy rate limits.
