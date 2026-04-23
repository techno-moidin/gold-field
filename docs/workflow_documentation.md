# Gold Field — Full Workflow & Session Log

> This document is the living record of all work done on the Gold Field React application.
> Every time code is changed, this document must be updated with the new entry.
> It serves as the single source of truth for resuming work across sessions.

---

## Project Overview

Gold Field is a **premium real-time gold rate tracking and analytics application**. It is a Telegram-first web app built with React + Vite + TypeScript. Users can:
- View live international gold rates across 6 regions (UAE, USA, India, Saudi, UK, EU)
- Get a daily AI-generated buy/wait/sell signal with confidence score
- View UAE-specific market analytics including premium, best buy time, and making charges
- Subscribe to Telegram alerts for price movement notifications

---

## Session 1: Initial Project Bootstrap (Conversation: a05a30a5)

### What Was Done
The entire frontend was scaffolded from scratch. This was a greenfield build based on the backend API documentation provided by the user.

**Stack chosen:**
- Vite + React + TypeScript as the build framework
- TanStack Query (React Query) for server state and caching
- Zustand for global UI state (selected region, purity, dark mode)
- Axios for all HTTP requests
- Recharts for data visualization
- Lucide React for iconography
- Tailwind CSS for utility-first styling

**Screens created:**
- `HomeScreen.tsx` — Grid of live rate cards per region
- `SignalScreen.tsx` — Daily buy/wait/sell signal with confidence reasoning
- `AlertsScreen.tsx` — Telegram subscription form
- `UAEMarketScreen.tsx` — UAE market premium gauges and insights

**Core files created:**
- `src/lib/api.ts` — Axios-based API client class with all endpoint methods
- `src/hooks/useGoldRates.ts` — TanStack Query hooks wrapping the API calls
- `src/store/useStore.ts` — Zustand store for persisted UI state
- `src/types/gold-field.ts` — Full TypeScript type definitions for all API responses
- `src/components/PriceCard.tsx` — Card showing region/purity/price with trend indicator
- `src/components/PriceChart.tsx` — Recharts sparkline for price history
- `src/components/PremiumGauge.tsx` — Circular gauge for UAE premium percentage
- `src/components/SignalBadge.tsx` — Color-coded badge for BUY/WAIT/AVOID signals

---

## Session 2: Gilded Vault Design System (Conversation: cebcfe95)

### What Was Done
The entire visual design was overhauled to implement the **"Gilded Vault"** premium design system, which was designed by the user in Google Stitch (project: `projects/18254344533835817335`).

**Design tokens applied:**
- **Primary color:** `#f2ca50` (gold amber)
- **Background:** `#0c1117` (very dark navy)
- **Surface layers:** `#111827`, `#1a2233`, `#1f2a3c` (tonal surface containers)
- **Text on dark:** `#e8e0c8`, `#c4b99a` (warm parchment whites)
- **Font:** Inter (Google Fonts)

**Key changes:**
- Migrated to **Tailwind CSS v4** using the new `@tailwindcss/vite` plugin
- Replaced all CSS class-based theming with CSS custom properties mapped to Tailwind
- `src/index.css` was rewritten to define all design tokens as CSS variables in `:root`
- Navigation redesigned: responsive side nav on desktop, bottom tab bar on mobile
- `App.tsx` restructured to split `AppContent` from the root `App` wrapper so `QueryClientProvider` could be lifted up

**UI polish:**
- Hero header with animated gold logo
- Card glass effects using `backdrop-blur`
- Micro-animations on hover states
- Sticky top navigation with blur effect
- `public/assets/vault_texture.png` and `public/assets/market_insight.png` added as premium background assets

---

## Session 3: Maintenance Page (Current Conversation — first half)

### Context
The user requested a high-fidelity **Maintenance Screen** that would be displayed whenever the backend API is unreachable, throwing a server error, or returning 5xx status codes. The design reference was the Stitch project `projects/18254344533835817335`.

### Files Created
**`src/screens/MaintenanceScreen.tsx`** — New screen created entirely from scratch.
- Designed to match the Stitch design: dark navy vault aesthetic
- Contains: animated vault icon, "System Sync In Progress" headline, animated status bars, status checklist items (Exchange Feed, Signal Engine, Telegram Gateway, Premium Data Vault)
- All colors are written as **absolute HEX values** (not CSS variables) specifically to ensure the screen renders correctly even if CSS theme processing fails during a startup crash
- Added a **"Force Synchronize"** button at the bottom that calls `window.location.reload()`
- Added a **"Background Auto-Sync Active (5s)"** label to indicate the polling status

### Files Modified

**`src/store/useStore.ts`**
- Added `isMaintenanceMode: boolean` state field (default: `false`)
- Added `setMaintenanceMode: (status: boolean) => void` action method
- The field is persisted via `zustand/middleware/persist` so it survives page reloads

**`src/lib/api.ts`**
- Added Axios response interceptors to the `ApiClient` constructor
- **Success interceptor:** On every successful API response (2xx), calls `useStore.getState().setMaintenanceMode(false)` to clear maintenance mode if it was previously active
- **Error interceptor:** If the error has no response (network error / server unreachable) OR if the HTTP status is >= 500, calls `useStore.getState().setMaintenanceMode(true)` to activate the maintenance screen

**`src/App.tsx`**
- Lifted `QueryClientProvider` outside of `AppContent` so the query client is available globally and not re-created on re-renders
- Extracted `AppContent` as a child component that reads `isMaintenanceMode` from the Zustand store
- Added conditional rendering: `if (isMaintenanceMode) return <MaintenanceScreen />`

---

## Session 3: TypeScript Build Fix (Current Conversation — second half)

### Context
The user ran `npm run build` and got 11 TypeScript compilation errors. All were resolved.

### Error 1: `enum` is not allowed (`erasableSyntaxOnly`)

**File:** `src/types/gold-field.ts`

**Root cause:** The project's `tsconfig.json` enables `erasableSyntaxOnly` (also related to the `verbatimModuleSyntax` setting), which disallows TypeScript-only constructs that have runtime behavior — including `enum`. TypeScript enums generate JavaScript code at runtime, which violates this rule.

**Fix applied:** All 6 enums were converted to `const` objects with companion type aliases:

```typescript
// BEFORE (broken)
export enum Region {
  UAE = 'UAE',
  USA = 'USA',
}

// AFTER (fixed)
export const Region = {
  UAE: 'UAE',
  USA: 'USA',
} as const;
export type Region = typeof Region[keyof typeof Region];
```

This pattern is semantically identical at the call site (`Region.UAE` still works) and is fully compatible with strict TS settings. The 6 converted constants were: `Region`, `GoldPurity`, `Currency`, `SignalType`, `SignalConfidence`, `AlertFrequency`.

### Error 2: `AxiosInstance` is a type-only import

**File:** `src/lib/api.ts`

**Root cause:** Under `verbatimModuleSyntax`, TypeScript requires type-only imports to use `import type` syntax. `AxiosInstance` is a TypeScript interface and must be imported with `import type`.

**Fix applied:**
```typescript
// BEFORE
import axios, { AxiosInstance } from 'axios';

// AFTER
import axios, { type AxiosInstance } from 'axios';
```

### Error 3: Missing `subscribe` method on `ApiClient`

**File:** `src/lib/api.ts`

**Root cause:** `AlertsScreen.tsx` calls `api.subscribe(...)` but the method was never implemented on the `ApiClient` class, causing a TypeScript "property does not exist" error.

**Fix applied:** Implemented the `subscribe` method:

```typescript
async subscribe(data: {
  telegramUsername: string;
  region: Region;
  purity: GoldPurity;
  frequency: AlertFrequency;
}): Promise<void> {
  await this.client.post('/alerts/subscribe', data);
}
```

This also required adding `AlertFrequency` to the import statement from `../types/gold-field`.

### Error 4: Unused variable `refetch`

**File:** `src/screens/HomeScreen.tsx`

**Root cause:** `const { data: rates, isLoading, refetch } = useLiveRates()` destructured `refetch` which was never used in the component body, violating the `noUnusedLocals` TypeScript rule.

**Fix applied:** Removed `refetch` from the destructuring.

### Error 5: Unused variable `cn` and its imports in `UAEMarketScreen.tsx`

**File:** `src/screens/UAEMarketScreen.tsx`

**Root cause:** A `cn()` utility function was defined in the file using `clsx` and `twMerge`, but it was never called anywhere in that component. This generated two errors: the function itself was unused, and its imports (`clsx`, `twMerge`) became "all imports unused" errors.

**Fix applied:** Removed the `cn` function definition and its two import lines entirely.

### Error 6: Unused `useMemo` import in `App.tsx`

**File:** `src/App.tsx`

**Root cause:** `useMemo` was imported from React but never used.

**Fix applied:** Removed `useMemo` from the React import line.

---

## Session 3: White Screen / Maintenance Mode Loop Fix

### Context
After the maintenance page was built, the user reported a **full white screen** when running the frontend without a backend. Later, after the backend was running, the user was **stuck on the maintenance page** with no way out.

### Root Cause 1 — White Screen
The initial `App.tsx` had the `QueryClientProvider` inside `AppContent`, which caused React rendering to fail before the store could be read, resulting in a white screen.

**Fix:** Moved `QueryClientProvider` above `AppContent` in the component tree so it wraps everything.

### Root Cause 2 — Stuck on Maintenance Page
The maintenance mode state is **persisted in localStorage** by Zustand's persist middleware. Once set to `true`, it stayed `true` even after the backend came back online — because while the maintenance screen was showing, no new API calls were being made to clear the state.

**Fix applied in `src/App.tsx`:** Added a `useEffect` that polls the backend every 5 seconds when the app is in maintenance mode:

```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (isMaintenanceMode) {
    interval = setInterval(async () => {
      try {
        await api.getLiveRates();
        setMaintenanceMode(false); // Backend recovered — clear the flag
      } catch (e) {
        // Still down — do nothing
      }
    }, 5000);
  }
  return () => clearInterval(interval);
}, [isMaintenanceMode, setMaintenanceMode]);
```

---

## Session 3: CORS and Live Data Fix

### Context
The user reported that even with the backend running at `https://hqxlqr98-8001.inc1.devtunnels.ms`, the UI showed "No live rates available" with no cards visible.

### Root Cause 1 — CORS

Browsers enforce the **Same-Origin Policy**. The frontend runs on `http://localhost:5174` (a different origin from the backend tunnel). Direct browser fetch requests to the tunnel URL were silently blocked by CORS.

The `curl` tests I ran worked fine because `curl` does not enforce CORS — this masked the real browser issue.

**Fix applied:** Added a **Vite dev proxy** in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://hqxlqr98-8001.inc1.devtunnels.ms',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      headers: {
        'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
      },
    },
  },
},
```

With this proxy, the browser sends requests to `http://localhost:5173/api/...` (same origin — no CORS). Vite's dev server then forwards the request to the tunnel server-side, where CORS rules don't apply. The tunnel bypass header is also safely attached here.

### Root Cause 2 — Anti-Phishing Page

Microsoft Dev Tunnels shows an HTML "anti-phishing warning page" to any first-time visitor. Without bypass, the frontend receives an HTML document instead of JSON, causing parsing failures.

**Fix:** The Vite proxy adds `X-Tunnel-Skip-Anti-Phishing-Page: true` header server-side, bypassing the warning page without triggering browser CORS preflight.

**Note:** Adding this header directly to Axios (original fix attempt) caused a CORS preflight `OPTIONS` request that the tunnel rejected, making things worse. Moving it to the proxy is the correct approach.

### Root Cause 3 — API Base URL

**File:** `src/lib/api.ts`

After the proxy was added, the API base URL was changed to use the proxy path:

```typescript
// BEFORE
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hqxlqr98-8001.inc1.devtunnels.ms';

// AFTER (uses Vite proxy in dev)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

In production, set `VITE_API_URL` to the full backend URL.

### Root Cause 4 — Single Object vs Array

The `useLiveRates` hook was sending both `region=UAE` and `purity=24K` as query parameters to the backend. When both filters are provided, the backend returns a **single object** (not an array). The `rates?.map()` call then crashed because you can't `.map()` an object.

**Fix 1** — Normalization in `src/lib/api.ts`:
```typescript
const data = response.data;
if (data && !Array.isArray(data)) {
  return [data]; // Wrap single object in array
}
return data || [];
```

**Fix 2** — Refactored `src/hooks/useGoldRates.ts`:
Instead of sending region+purity to the API, the hook now fetches **all rates** and filters client-side by purity:

```typescript
export function useLiveRates() {
  const { selectedPurity } = useStore();
  
  const query = useQuery({
    queryKey: ['liveRates'],
    queryFn: () => api.getLiveRates(), // No filters — get everything
    refetchInterval: 60000,
    placeholderData: (previousData) => previousData,
  });

  const filtered = Array.isArray(query.data)
    ? query.data.filter((r) => r.purity === selectedPurity)
    : [];

  return { ...query, data: filtered };
}
```

This ensures the Home Screen always shows all 6 regions for the selected purity.

### Root Cause 5 — No Error Feedback

**File:** `src/screens/HomeScreen.tsx`

Added a proper `isError` check so network failures show a human-readable error message instead of a cryptic empty screen:

```tsx
if (isError) {
  return (
    <div>
      <p>Failed to connect to the exchange.</p>
      <p>Check that the backend is running and the tunnel is accessible.</p>
    </div>
  );
}
```

---

## Pending Tasks

The following items have been identified but not yet completed:

### High Priority
- [ ] **Production deployment config** — `VITE_API_URL` must be set in production to the full backend URL (not `/api`). The proxy only works in dev. Build documentation or a `.env.production.example` file is needed.
- [ ] **Alerts screen end-to-end test** — The `api.subscribe()` method is implemented but the full Telegram subscription flow has NOT been tested with a real Telegram username against the live backend. Need to verify the `/alerts/subscribe` endpoint works and the user receives a Telegram message.
- [ ] **Signal screen data validation** — `useTodaySignal()` returns raw signal data. It needs the same defensive error handling added to `HomeScreen` (isError state, loading state) to prevent potential crashes.
- [ ] **UAE Market screen data validation** — `useMarketSummary()` similarly needs proper `isError` and `isLoading` guard states. Currently the `PremiumGauge` component receives `undefined` props if data hasn't loaded.

### Medium Priority
- [ ] **PremiumGauge null safety** — The `PremiumGauge` component in `UAEMarketScreen` receives `premium.current` which could be `undefined`. The component should handle null/undefined gracefully.
- [ ] **Price history chart** — `PriceChart.tsx` exists but currently has no real data source. The backend does not appear to have a price history endpoint. Either mock data or a new backend endpoint is needed.
- [ ] **Region filter in Home Screen** — The `selectedRegion` state exists in the store but is no longer used in `useLiveRates`. The UI has no region selector. Either add a region selector or remove `selectedRegion` from the store to avoid confusion.
- [ ] **Stale maintenance state cleanup** — If `isMaintenanceMode` is persisted and the user clears their browser storage, they should land on the home screen. But if they visit the site fresh, the state is `false` by default — this is fine. However, testing should confirm there are no edge cases with the persistence.

### Low Priority
- [ ] **Code splitting / bundle size** — The production bundle is 796KB (warned by Vite). Consider lazy-loading screens with `React.lazy()` and `Suspense`.
- [ ] **Remove unused `selectedRegion` from store** — Now that client-side filtering only uses `selectedPurity`, the `selectedRegion` in the store is dead code. It should be cleaned up unless future region filtering is planned.
- [ ] **Responsive mobile testing** — The bottom nav bar and card grid layout have been built for mobile but have not been formally tested on real device viewports.
- [ ] **`index.html` meta tags** — The page title and description need to be updated for SEO and Telegram link preview.

---

## Environment Variables

| Variable | Used In | Purpose |
|---|---|---|
| `VITE_API_URL` | `src/lib/api.ts` | Override the API base URL. In dev, defaults to `/api` (proxied). In production, set to full backend URL. |

---

## Dev Tunnel Note

The backend is currently accessible via a Microsoft Dev Tunnel at:
`https://hqxlqr98-8001.inc1.devtunnels.ms`

This URL changes if the tunnel is restarted. To update it:
1. Change the `target` in `vite.config.ts` proxy config
2. If `VITE_API_URL` is set in `.env`, update that instead

