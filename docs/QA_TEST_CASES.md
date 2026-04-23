# Gold Field — QA Test Case Documentation

> **Living Document** — Every time a new feature or UI change is deployed, this file must be updated with new or modified test cases.
> This document is intended for QA engineers to perform structured testing across: UI behaviour, backend APIs, live data integrity, and external service verification.

---

## Document Info

| Field | Value |
|---|---|
| **App Name** | Gold Field Premium Terminal |
| **Frontend URL (Dev)** | `http://localhost:5173` |
| **Backend URL (Dev Tunnel)** | `https://hqxlqr98-8001.inc1.devtunnels.ms` |
| **Last Updated** | 2026-04-23 |
| **Version** | 1.0.0 |

---

## How to Use This Document

- Each test case has a unique **TC ID** (e.g. `TC-HOME-01`)
- **Priority**: P1 = Critical (must pass before release), P2 = High, P3 = Medium, P4 = Low
- **Status column**: Mark as `PASS`, `FAIL`, or `SKIP` during each test session
- When a new feature is added, append new test cases to the relevant section — do not delete old ones (mark them `DEPRECATED` if no longer applicable)

---

## Section 1: Environment Setup Verification

These checks must pass before any other testing begins.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-ENV-01 | Dev server starts successfully | Run `npm run dev` | Server starts on port 5173 (or 5174) with no errors | P1 |
| TC-ENV-02 | Backend tunnel is reachable | Open `https://hqxlqr98-8001.inc1.devtunnels.ms/gold-rates/live` in browser | JSON array of gold rate objects returned (not the anti-phishing HTML page) | P1 |
| TC-ENV-03 | Vite proxy routes correctly | With dev server running, `curl http://localhost:5173/api/gold-rates/live` | Same JSON array returned as direct backend call | P1 |
| TC-ENV-04 | Production build succeeds | Run `npm run build` | Exit code 0, no TypeScript errors, `dist/` folder created | P1 |
| TC-ENV-05 | No console errors on cold start | Open app in browser, open DevTools console, hard refresh (Cmd+Shift+R) | Zero red errors in console | P1 |

---

## Section 2: Application Shell & Navigation

Tests for the overall app frame, navigation layout, and screen routing.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-NAV-01 | App loads with correct title | Open `http://localhost:5173` | Browser tab shows "Gold Field \| Premium Terminal" | P2 |
| TC-NAV-02 | Markets nav item loads HomeScreen | Click "Markets" in sidebar (desktop) or bottom nav (mobile) | HomeScreen is displayed with "Global Rates" heading | P1 |
| TC-NAV-03 | Signals nav item loads SignalScreen | Click "Signals" | SignalScreen is displayed with today's signal badge | P1 |
| TC-NAV-04 | Details nav item loads AlertsScreen | Click "Details" | AlertsScreen form is displayed | P1 |
| TC-NAV-05 | UAE Vault nav item loads UAEMarketScreen | Click "UAE Vault" | UAEMarketScreen is displayed with premium gauge | P1 |
| TC-NAV-06 | Active nav item is highlighted | Click each nav item | The clicked item shows amber/gold highlight; others are muted | P2 |
| TC-NAV-07 | Desktop: sidebar is visible | View on screen width ≥ 768px | Left sidebar with nav items is visible | P2 |
| TC-NAV-08 | Mobile: bottom nav replaces sidebar | View on screen width < 768px | Sidebar is hidden, bottom tab bar appears | P2 |
| TC-NAV-09 | Top header is always visible | Scroll down on any long screen | Header remains sticky at top | P2 |
| TC-NAV-10 | Inter font is loaded | Open DevTools → Network → filter "Font" | `Inter` font files are loaded from Google Fonts | P3 |
| TC-NAV-11 | Material Symbols icons render | Check nav icons in sidebar and header | Icons (dashboard, analytics, etc.) render correctly, not as blank squares | P2 |

---

## Section 3: HomeScreen — Live Rates Grid

Tests for the main rates dashboard and data display.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-HOME-01 | Loading state shown on first visit | Clear app cache (localStorage), refresh page | Spinner with "Synchronizing Global Rates..." is shown briefly | P2 |
| TC-HOME-02 | Rate cards appear after load | Wait for data to load | Grid of 6 region cards shown (USA, India, UAE, Saudi, UK, EU) | P1 |
| TC-HOME-03 | 24K purity filter selected by default | View HomeScreen on fresh load | "24K" purity button is highlighted; 6 rate cards for 24K shown | P1 |
| TC-HOME-04 | Switching to 22K shows correct cards | Click "22K" purity button | Cards update to show 22K prices; correct currency and region labels | P1 |
| TC-HOME-05 | Switching to 18K shows correct cards | Click "18K" purity button | Cards update to show 18K prices | P1 |
| TC-HOME-06 | Purity selection persists on refresh | Select "22K", refresh the page | "22K" is still selected, 22K cards are shown after reload | P2 |
| TC-HOME-07 | PriceCard shows correct data fields | Inspect any rate card | Shows: Region name, Currency, Price per gram, Bid/Ask, High/Low 24h, Change % | P1 |
| TC-HOME-08 | Positive change shows green color | Find a rate with positive 24h change | Change value and indicator are green-colored | P2 |
| TC-HOME-09 | Negative change shows red color | Find a rate with negative 24h change | Change value and indicator are red-colored | P2 |
| TC-HOME-10 | Auto-refresh every 60 seconds | Keep HomeScreen open for >60 seconds, watch Network tab | A new request to `/api/gold-rates/live` is made automatically every 60s | P2 |
| TC-HOME-11 | Backend error shows error message | Stop backend server, refresh app | "Failed to connect to the exchange" message is displayed, not a white screen | P1 |
| TC-HOME-12 | News hero card displays background image | View bottom of HomeScreen | The "Market Insight" card shows `market_insight.png` as background | P3 |
| TC-HOME-13 | Sparkline chart inside PriceCard | Inspect a PriceCard | A small area chart/sparkline is visible at bottom of each card | P3 |

---

## Section 4: SignalScreen — Daily Intelligence

Tests for the buy/sell/wait signal display.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-SIG-01 | SignalScreen loads without crash | Navigate to Signals screen | Screen displays without errors or white screen | P1 |
| TC-SIG-02 | Signal badge renders correctly | View the signal type badge | Badge shows one of: BUY (green), WAIT (amber), AVOID (red) | P1 |
| TC-SIG-03 | Signal confidence is displayed | Check confidence level | Shows HIGH, MEDIUM, or LOW with appropriate formatting | P1 |
| TC-SIG-04 | Reasoning text is shown | Read the reasoning block | A non-empty paragraph of reasoning from the backend is displayed | P1 |
| TC-SIG-05 | Metrics grid shows all 5 metrics | Check metrics section | Displays: 24K Price, 24h Change, 7d Trend, 30d Trend, Local Premium | P1 |
| TC-SIG-06 | Disclaimer text is present | Scroll to bottom of signal screen | Disclaimer text is shown (e.g., "for informational purposes only…") | P2 |
| TC-SIG-07 | Signal date matches today's date | Check the signal date shown | Date matches today's date (YYYY-MM-DD format) | P1 |
| TC-SIG-08 | Screen shows loading state | Clear cache, navigate to Signals | Loading spinner or skeleton shown while data fetches | P2 |
| TC-SIG-09 | Screen handles API error gracefully | Stop backend, navigate to Signals | Error state shown gracefully, no uncaught JS exception | P2 |

---

## Section 5: AlertsScreen — Telegram Subscription

Tests for the alert subscription form and submission flow.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-ALERT-01 | Form renders all fields | Navigate to Details/Alerts screen | Shows: Telegram Username input, Region selector, Purity selector, Frequency selector | P1 |
| TC-ALERT-02 | Submit with empty username shows validation | Leave username blank, click Subscribe | Validation error or button disabled; form does not submit | P1 |
| TC-ALERT-03 | Valid submission triggers API call | Fill all fields (username: `@testuser`, region: UAE, purity: 24K, frequency: Daily), click Subscribe | Network tab shows POST to `/api/alerts/subscribe` with correct payload | P1 |
| TC-ALERT-04 | Successful submission shows confirmation | Submit with valid data and working backend | Success message shown (e.g., "Subscribed successfully!") | P1 |
| TC-ALERT-05 | API error shows feedback | Submit with valid data but backend down | Error message shown, form does not break/crash | P1 |
| TC-ALERT-06 | All regions available in selector | Expand region dropdown | Shows: UAE, USA, India, Saudi, UK, EU | P2 |
| TC-ALERT-07 | All purities available in selector | Expand purity dropdown | Shows: 24K, 22K, 18K | P2 |
| TC-ALERT-08 | All frequencies available in selector | Expand frequency dropdown | Shows: DAILY, WEEKLY, INSTANT | P2 |
| TC-ALERT-09 | POST payload is correctly structured | Inspect network request body on submit | Body is `{ telegramUsername, region, purity, frequency }` with correct values | P1 |

---

## Section 6: UAEMarketScreen — Market Analytics

Tests for the UAE-specific premium gauge and market data.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-UAE-01 | Screen loads without crash | Navigate to UAE Vault | Screen renders without errors | P1 |
| TC-UAE-02 | Premium gauge is visible | View top of screen | SVG arc gauge showing UAE premium % is displayed | P1 |
| TC-UAE-03 | Premium gauge shows correct value | Check gauge value vs API response | Gauge value matches `premium.current` from `/uaemarts/summary` | P1 |
| TC-UAE-04 | Best buy day displayed | Check best time section | "Best Day" field shows a day name (e.g., "Thursday") | P1 |
| TC-UAE-05 | Best buy time displayed | Check best time section | "Best Time" field shows a time range (e.g., "10 AM - 12 PM") | P1 |
| TC-UAE-06 | Best time reason is shown | Check reason text | Explanatory text about why this time is best is displayed | P2 |
| TC-UAE-07 | Making charges shown for 24K | Scroll to making charges section | Per gram (min/max/avg) and per piece (min/max/avg) shown for 24K | P1 |
| TC-UAE-08 | Making charges shown for 22K | Check 22K row | Making charges for 22K are different from 24K | P1 |
| TC-UAE-09 | Making charges shown for 18K | Check 18K row | Making charges for 18K are the lowest of the three | P1 |
| TC-UAE-10 | VAT info section is displayed | Scroll to VAT section | VAT rate (5%) and applicable items are listed | P2 |
| TC-UAE-11 | Premium trend indicator shows correctly | Check trend direction | Shows "increasing", "decreasing", or "stable" with appropriate icon | P2 |
| TC-UAE-12 | Screen auto-refreshes every 5 minutes | Keep screen open >5 min, watch Network tab | New request to `/api/uaemarts/summary` is made every 5 minutes | P3 |

---

## Section 7: Maintenance Screen

Tests for the error/maintenance fallback screen.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-MAINT-01 | Maintenance screen triggers on backend down | Stop backend server, refresh app | Maintenance screen shown (dark vault aesthetic, animated status items) | P1 |
| TC-MAINT-02 | All status checklist items visible | View maintenance screen | Shows: Exchange Feed, Signal Engine, Telegram Gateway, Premium Data Vault | P2 |
| TC-MAINT-03 | "Force Synchronize" button present | View bottom of maintenance screen | Gold "Force Synchronize" button is visible | P2 |
| TC-MAINT-04 | Force Synchronize button triggers reload | Click "Force Synchronize" | Page reloads | P2 |
| TC-MAINT-05 | Auto-recovery when backend returns | Start with backend down (maintenance shown), then start backend | Within 5–10 seconds, maintenance screen disappears and HomeScreen loads | P1 |
| TC-MAINT-06 | Maintenance state persists across refresh | With backend down, get maintenance screen, then refresh | Maintenance screen still shown after refresh | P2 |
| TC-MAINT-07 | Maintenance screen visible even if CSS fails | Force-disable CSS in DevTools, check if maintenance screen is still styled | Screen should still show text and layout with hardcoded HEX colors | P3 |
| TC-MAINT-08 | No white screen when backend is cold | Start frontend before backend, observe | Maintenance screen shown immediately, not a white/blank screen | P1 |

---

## Section 8: Backend API Verification

Direct API tests to verify the backend responses. These should be run separately from frontend testing (e.g., using Postman, Insomnia, or curl).

### Base URL: `https://hqxlqr98-8001.inc1.devtunnels.ms`
> **Note:** Add header `X-Tunnel-Skip-Anti-Phishing-Page: true` to all requests when calling from Postman/curl.

### 8.1 Live Rates Endpoint

| TC ID | Test Case | Request | Expected Response | Priority |
|---|---|---|---|---|
| TC-API-01 | Get all rates | `GET /gold-rates/live` | HTTP 200, JSON array of 18 objects (6 regions × 3 purities) | P1 |
| TC-API-02 | Filter by region only | `GET /gold-rates/live?region=UAE` | HTTP 200, array of 3 objects (24K, 22K, 18K for UAE) | P1 |
| TC-API-03 | Filter by purity only | `GET /gold-rates/live?purity=24K` | HTTP 200, array of 6 objects (one per region, all 24K) | P1 |
| TC-API-04 | Filter by region AND purity | `GET /gold-rates/live?region=UAE&purity=24K` | HTTP 200, single object OR array with one item | P1 |
| TC-API-05 | Response fields present | Check any response object | Contains: `region`, `currency`, `purity`, `pricePerGram`, `pricePerOunce`, `bid`, `ask`, `change24h`, `changePercent24h`, `high24h`, `low24h`, `timestamp`, `cached` | P1 |
| TC-API-06 | `pricePerGram` is a number | Check value | Not null, not a string, is a valid float | P1 |
| TC-API-07 | `timestamp` is ISO format | Check value | Matches format `YYYY-MM-DDTHH:mm:ss.sssZ` | P2 |
| TC-API-08 | UAE price is in AED | Check UAE response | `currency` = `AED`, price range > 300 AED/g | P1 |
| TC-API-09 | USA price is in USD | Check USA response | `currency` = `USD`, price range > 80 USD/g | P1 |
| TC-API-10 | India price is in INR | Check India response | `currency` = `INR`, price range > 7000 INR/g | P1 |
| TC-API-11 | Invalid region returns error | `GET /gold-rates/live?region=MARS` | HTTP 400 or 404, or empty array (not a server crash) | P2 |

### 8.2 Signals Endpoint

| TC ID | Test Case | Request | Expected Response | Priority |
|---|---|---|---|---|
| TC-API-20 | Get today's signal | `GET /signals/today` | HTTP 200, JSON object with `signal`, `confidence`, `reasoning`, `metrics`, `disclaimer` | P1 |
| TC-API-21 | Signal value is valid | Check `signal` field | Value is one of: `BUY`, `WAIT`, `AVOID` | P1 |
| TC-API-22 | Confidence value is valid | Check `confidence` field | Value is one of: `HIGH`, `MEDIUM`, `LOW` | P1 |
| TC-API-23 | Metrics object is complete | Check `metrics` field | Contains: `price24k`, `change24h`, `changePercent24h`, `trend7d`, `trend30d`, `localPremium` | P1 |
| TC-API-24 | Signal date is today | Check `date` field | Matches today's date in `YYYY-MM-DD` format | P1 |
| TC-API-25 | Reasoning is non-empty | Check `reasoning` field | Non-empty string, at least 20 characters | P2 |

### 8.3 UAE Market Summary Endpoint

| TC ID | Test Case | Request | Expected Response | Priority |
|---|---|---|---|---|
| TC-API-30 | Get UAE market summary | `GET /uaemarts/summary` | HTTP 200, JSON with `premium`, `bestTime`, `makingCharges`, `vatInfo` | P1 |
| TC-API-31 | Premium object is present | Check `premium` field | Contains: `current`, `average7d`, `average30d`, `trend`, `recommendation` | P1 |
| TC-API-32 | Trend value is valid | Check `premium.trend` | Value is one of: `increasing`, `decreasing`, `stable` | P1 |
| TC-API-33 | Best time object is present | Check `bestTime` field | Contains: `bestDay`, `bestTime`, `reason`, `averagePriceDiff` | P1 |
| TC-API-34 | Making charges present for all purities | Check `makingCharges` array | Contains 3 items: for `24K`, `22K`, `18K` | P1 |
| TC-API-35 | Making charge per gram fields present | Check one making charges item | Contains `purity`, `perGram.min`, `perGram.max`, `perGram.average` | P1 |
| TC-API-36 | VAT info present | Check `vatInfo` field | Contains `rate` (should be `5`) and `appliesTo` array | P2 |

### 8.4 Alerts Subscribe Endpoint

| TC ID | Test Case | Request | Expected Response | Priority |
|---|---|---|---|---|
| TC-API-40 | Valid subscription | `POST /alerts/subscribe` with body `{ "telegramUsername": "@qatest", "region": "UAE", "purity": "24K", "frequency": "DAILY" }` | HTTP 200 or 201, success confirmation | P1 |
| TC-API-41 | Missing required fields | `POST /alerts/subscribe` with empty body | HTTP 400 with validation error message | P1 |
| TC-API-42 | Invalid purity value | `POST /alerts/subscribe` with `"purity": "99K"` | HTTP 400 with validation error | P2 |
| TC-API-43 | Invalid frequency value | `POST /alerts/subscribe` with `"frequency": "HOURLY"` | HTTP 400 with validation error | P2 |
| TC-API-44 | Invalid region value | `POST /alerts/subscribe` with `"region": "MARS"` | HTTP 400 with validation error | P2 |

---

## Section 9: Live Data Integrity Verification

These tests verify that the UI data accurately reflects the real-world backend data.

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-DATA-01 | UAE 24K rate matches API | 1. Call `GET /gold-rates/live?region=UAE&purity=24K` via Postman. 2. Note `pricePerGram`. 3. Open app to HomeScreen, select 24K. 4. Find UAE card. | `pricePerGram` shown in UAE card matches API value (within rounding) | P1 |
| TC-DATA-02 | India 24K rate matches API | Repeat TC-DATA-01 for India/INR | INR price shown matches API value | P1 |
| TC-DATA-03 | Signal type matches API | 1. Call `GET /signals/today`. 2. Note `signal` value. 3. Open Signals screen. | Badge type (BUY/WAIT/AVOID) matches API value | P1 |
| TC-DATA-04 | UAE premium gauge matches API | 1. Call `GET /uaemarts/summary`. 2. Note `premium.current`. 3. Open UAE Vault. | Gauge reading matches `premium.current` value | P1 |
| TC-DATA-05 | 24h change sign is correct | Note whether `change24h` is positive or negative from API. Check PriceCard color. | Positive → green, Negative → red | P2 |
| TC-DATA-06 | Timestamp freshness | Check `timestamp` field in live rates response | Timestamp is within the last 15 minutes; `cached: false` | P2 |
| TC-DATA-07 | Rate auto-updates after 60s | Note a price value. Wait 62 seconds. Check if the value changes (price changes are possible). | If market is active, value may change. Network tab shows a new API request was made. | P2 |

---

## Section 10: Cross-Browser & Responsive Testing

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-CROSS-01 | App works in Chrome | Open in Chrome (latest) | All screens load correctly, no visual regressions | P1 |
| TC-CROSS-02 | App works in Safari | Open in Safari (latest) | All screens load correctly | P1 |
| TC-CROSS-03 | App works in Firefox | Open in Firefox (latest) | All screens load correctly | P2 |
| TC-CROSS-04 | Mobile view (375px) | Set DevTools to 375px wide | Bottom nav is visible, cards stack in 1 column, no horizontal scrollbar | P1 |
| TC-CROSS-05 | Tablet view (768px) | Set DevTools to 768px wide | Layout transitions correctly between mobile and desktop modes | P2 |
| TC-CROSS-06 | Desktop view (1280px+) | Set DevTools to 1280px | Sidebar is visible, cards show in 3-column grid | P1 |
| TC-CROSS-07 | No horizontal overflow on mobile | On 375px width, check no content overflows | No horizontal scrollbar, all content fits within viewport | P2 |

---

## Section 11: Performance & Error Resilience

| TC ID | Test Case | Steps | Expected Result | Priority |
|---|---|---|---|---|
| TC-PERF-01 | First load time | Open Network tab with throttling off, hard-refresh | Page fully interactive within 3 seconds on local network | P2 |
| TC-PERF-02 | No memory leaks on screen switching | Switch between all 4 screens rapidly 20+ times | No browser crash, no growing memory in DevTools Performance tab | P3 |
| TC-ERR-01 | Network disconnect recovery | Disconnect WiFi while app is open, then reconnect | App shows maintenance screen when disconnected, auto-recovers when reconnected | P1 |
| TC-ERR-02 | Slow network handling | Use DevTools network throttling (Slow 3G), open app | Loading states display correctly; no timeout crashes | P2 |
| TC-ERR-03 | LocalStorage cleared | Clear localStorage, refresh app | App loads fresh (default purity: 24K) without errors | P2 |
| TC-ERR-04 | Rapid purity switching | Click 24K → 22K → 18K → 24K rapidly | No race conditions; final selection's cards are shown correctly | P2 |

---

## Appendix A: Test Session Log Template

Copy this table for each test session:

```
## Test Session — [DATE]

| Tester | Environment | Browser | Backend URL |
|---|---|---|---|
| [Name] | Dev / Staging / Prod | Chrome 124 | https://... |

| TC ID | Result | Notes |
|---|---|---|
| TC-ENV-01 | PASS / FAIL / SKIP | |
| TC-ENV-02 | | |
| ... | | |

**Blockers:**
- (list any P1 failures here)

**Notes:**
- (any observations)
```

---

## Appendix B: How to Update This Document

When a new frontend feature is shipped:

1. Add new test cases in the relevant section (or create a new section if it's a new screen)
2. Give new TCs the next sequential ID in that section (e.g. if last is `TC-HOME-13`, next is `TC-HOME-14`)
3. Update the **Last Updated** date in the Document Info table
4. Mark any test cases that are no longer applicable as `[DEPRECATED]` instead of deleting them — historical context matters
5. If a backend endpoint changes, update the relevant API test case in Section 8
6. Add the change to `workflow_documentation.md` as well
