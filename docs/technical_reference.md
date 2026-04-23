# Gold Field — Technical Architecture Reference

> **Living Document** — This file must be updated every time code changes are made.  
> It serves as the single reference needed to understand, continue, or hand off the project in any conversation.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **App Name** | Gold Field |
| **Type** | Telegram Web App / Browser SPA |
| **Framework** | React 19 + Vite 8 + TypeScript |
| **Package Manager** | npm |
| **Root Directory** | `gold-field/` |
| **Dev Server** | `http://localhost:5173` (port may shift to 5174 if 5173 is busy) |
| **Backend (Dev)** | `https://hqxlqr98-8001.inc1.devtunnels.ms` (Microsoft Dev Tunnel, changes on restart) |

---

## 2. Directory Structure

```
gold-field/
├── public/
│   └── assets/
│       ├── market_insight.png       # Hero image used on HomeScreen news card
│       └── vault_texture.png        # Metallic texture for backgrounds (premium asset)
│
├── docs/                            # ← Project documentation (outside src)
│   ├── assets/
│   │   ├── market_insight.png       # Copy of the hero image asset
│   │   ├── vault_texture.png        # Copy of the vault texture asset
│   │   ├── market_insight_app.png   # Copy from public/assets
│   │   └── vault_texture_app.png    # Copy from public/assets
│   ├── technical_reference.md       # ← This file
│   ├── workflow_documentation.md    # Full session log + pending tasks
│   ├── PROJECT_BRIEFING.md          # Original project brief
│   ├── STITCH_AI_ADVICE.md          # Stitch design system notes
│   ├── FRONTEND_INTEGRATION/        # API integration docs
│   └── REPORTS/                     # Reports folder
│
├── src/
│   ├── main.tsx                     # React DOM root entry — mounts <App /> into #root
│   ├── App.tsx                      # Root component: QueryClient, nav logic, conditional rendering
│   ├── index.css                    # Global CSS: Tailwind imports + design token variables
│   │
│   ├── types/
│   │   └── gold-field.ts            # All TypeScript type definitions for API responses
│   │
│   ├── lib/
│   │   └── api.ts                   # Axios API client — all HTTP calls live here
│   │
│   ├── store/
│   │   └── useStore.ts              # Zustand global state (region, purity, dark mode, maintenance)
│   │
│   ├── hooks/
│   │   └── useGoldRates.ts          # TanStack Query hooks wrapping api.ts methods
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Main rates grid — all regions at selected purity
│   │   ├── SignalScreen.tsx         # Daily signal — BUY/WAIT/AVOID with reasoning
│   │   ├── AlertsScreen.tsx         # Telegram subscription form
│   │   ├── UAEMarketScreen.tsx      # UAE market analytics (premium, timing, making charges)
│   │   └── MaintenanceScreen.tsx    # Full-page error state — shown when backend is down
│   │
│   └── components/
│       ├── PriceCard.tsx            # Individual region rate card (used in HomeScreen grid)
│       ├── PriceChart.tsx           # Recharts sparkline (used inside PriceCard)
│       ├── PremiumGauge.tsx         # SVG arc gauge for UAE premium % (used in UAEMarketScreen)
│       └── SignalBadge.tsx          # Color-coded pill badge for BUY/WAIT/AVOID (used in SignalScreen)
│
├── index.html                       # Vite HTML shell — loads Inter font, Google Material Symbols
├── vite.config.ts                   # Vite config: React plugin, Tailwind v4 plugin, dev proxy
├── tsconfig.json                    # TypeScript strict config (includes erasableSyntaxOnly)
├── tsconfig.app.json                # App-specific TS config
├── package.json                     # Dependencies and scripts
└── .env (optional)                  # VITE_API_URL override for production
```

---

## 3. Entry Points

### `index.html`
The Vite HTML shell. Key elements:
- Loads **Inter** font from Google Fonts
- Loads **Material Symbols Outlined** icon font from Google Fonts (used for nav icons in `App.tsx`)
- Contains `<div id="root">` where React mounts
- The `<title>` is `Gold Field | Premium Terminal`

### `src/main.tsx`
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
Standard Vite React entry. Nothing custom here.

---

## 4. Root Application: `src/App.tsx`

This is the most complex file in the project. It has three responsibilities:

### 4.1 Global QueryClient
A single `QueryClient` instance is created **outside** all components so it is stable and not re-created on re-renders:
```typescript
const rootQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,        // Only retry once before showing error
      staleTime: 30000 // Data stays fresh for 30 seconds
    }
  }
});
```

### 4.2 `AppContent` Component
Handles all conditional rendering and navigation logic:
- Reads `isMaintenanceMode` from the Zustand store
- If `isMaintenanceMode === true`, renders `<MaintenanceScreen />` instead of the main app
- Contains a `useEffect` that polls the backend every 5 seconds when in maintenance mode, to auto-recover when the server comes back online
- Manages `activeScreen` local state (one of: `'home' | 'signal' | 'alerts' | 'uae'`)
- Renders the top navigation header, the responsive side nav (desktop), and the bottom tab nav (mobile)
- Renders the active screen inside a `<main>` content area

### 4.3 `App` (default export)
Wraps `AppContent` in `QueryClientProvider`:
```tsx
export default function App() {
  return (
    <QueryClientProvider client={rootQueryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
```

### 4.4 Navigation Structure
| Nav Item | Label | Screen ID | Icon |
|---|---|---|---|
| 1 | Markets | `home` | `dashboard` (Material Symbol) |
| 2 | Details | `alerts` | `analytics` (Material Symbol) |
| 3 | Signals | `signal` | `query_stats` (Material Symbol) |
| 4 | UAE Vault | `uae` | `account_balance` (Material Symbol) |

---

## 5. Type System: `src/types/gold-field.ts`

All types shared between the API client, hooks, and UI components.

### Constant Objects (formerly enums)
These were originally TypeScript `enum` but were refactored to `const` objects + type aliases due to `erasableSyntaxOnly` compiler restriction:

```typescript
export const Region = { UAE: 'UAE', USA: 'USA', INDIA: 'INDIA', SAUDI: 'SAUDI', UK: 'UK', EU: 'EU' } as const;
export type Region = typeof Region[keyof typeof Region]; // 'UAE' | 'USA' | ...

export const GoldPurity = { GOLD_24K: '24K', GOLD_22K: '22K', GOLD_18K: '18K' } as const;
export type GoldPurity = typeof GoldPurity[keyof typeof GoldPurity]; // '24K' | '22K' | '18K'

export const Currency = { AED: 'AED', USD: 'USD', INR: 'INR', SAR: 'SAR', GBP: 'GBP', EUR: 'EUR' } as const;
export const SignalType = { BUY: 'BUY', WAIT: 'WAIT', AVOID: 'AVOID' } as const;
export const SignalConfidence = { HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW' } as const;
export const AlertFrequency = { DAILY: 'DAILY', WEEKLY: 'WEEKLY', INSTANT: 'INSTANT' } as const;
```

### Interfaces

**`LiveRateResponse`** — One entry from `/gold-rates/live`:
```typescript
interface LiveRateResponse {
  region: Region;
  currency: Currency;
  purity: GoldPurity;
  pricePerGram: number;
  pricePerOunce: number;
  bid: number;
  ask: number;
  change24h: number | null;
  changePercent24h: number | null;
  high24h: number | null;
  low24h: number | null;
  timestamp: string;
  cached: boolean;
}
```

**`SignalResponse`** — From `/signals/today`:
```typescript
interface SignalMetrics {
  price24k: number; change24h: number; changePercent24h: number;
  trend7d: number; trend30d: number; localPremium: number;
}
interface SignalResponse {
  date: string; signal: SignalType; confidence: SignalConfidence;
  reasoning: string; metrics: SignalMetrics; disclaimer: string; lastUpdated: string;
}
```

**`UaeMarketSummary`** — From `/uaemarts/summary`:
```typescript
interface UaeMarketSummary {
  premium: { current: number; average7d: number; average30d: number; trend: 'increasing' | 'decreasing' | 'stable'; recommendation: string; };
  bestTime: { bestDay: string; bestTime: string; reason: string; averagePriceDiff: number; };
  lastUpdated: string;
}
```

---

## 6. API Client: `src/lib/api.ts`

A class-based Axios wrapper. One singleton is exported: `export const api = new ApiClient()`.

### Base URL Resolution
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```
- In **development**: defaults to `/api`, which is proxied by Vite to the backend tunnel (see `vite.config.ts`)
- In **production**: must be overridden by setting `VITE_API_URL` in the deployment environment

### Axios Instance Config
```typescript
this.client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### Interceptors
The constructor registers two interceptors for automatic maintenance mode management:

**Response (success) interceptor:**
- Fires on every 2xx response
- Calls `useStore.getState().setMaintenanceMode(false)` to clear maintenance if it was set

**Response (error) interceptor:**
- Fires on any failed request
- If `!error.response` (network error, server unreachable) OR `error.response.status >= 500`
- Calls `useStore.getState().setMaintenanceMode(true)` to show the maintenance screen

### Methods

| Method | Endpoint | Description |
|---|---|---|
| `getLiveRates(region?, purity?)` | `GET /gold-rates/live` | Fetch all live gold rates. Without params, returns array of all regions/purities. With both params, backend returns a single object — normalized to array internally. |
| `getTodaySignal()` | `GET /signals/today` | Returns today's BUY/WAIT/AVOID signal with confidence and reasoning. |
| `getMarketSummary()` | `GET /uaemarts/summary` | Returns UAE market analytics: premium, best time, making charges, VAT info. |
| `subscribe(data)` | `POST /alerts/subscribe` | Subscribes a Telegram user to price alerts. Body: `{ telegramUsername, region, purity, frequency }` |

### Response Normalization
`getLiveRates` includes a normalization guard because the backend returns different shapes depending on filters:
```typescript
const data = response.data;
if (data && !Array.isArray(data)) {
  return [data]; // Single object → wrap in array
}
return data || [];
```

---

## 7. Global State: `src/store/useStore.ts`

Zustand store with persistence via `localStorage`.

### State Fields

| Field | Type | Default | Purpose |
|---|---|---|---|
| `selectedRegion` | `Region` | `'UAE'` | Currently selected region (used for display context, not API filtering currently) |
| `selectedPurity` | `GoldPurity` | `'24K'` | Purity filter — applied client-side in `useLiveRates` |
| `isDarkMode` | `boolean` | `true` | UI dark/light mode toggle (toggle exists but mode is always dark currently) |
| `isMaintenanceMode` | `boolean` | `false` | When `true`, shows `MaintenanceScreen` instead of main app |

### Actions

| Action | Description |
|---|---|
| `setRegion(region)` | Updates `selectedRegion` |
| `setPurity(purity)` | Updates `selectedPurity` |
| `toggleDarkMode()` | Flips `isDarkMode` |
| `setMaintenanceMode(status)` | Sets `isMaintenanceMode` — called by API interceptors |

### Persistence
Persisted under the localStorage key `gold-field-storage`. All state fields survive page refresh. This means `isMaintenanceMode` can persist too — which is intentional, but the background polling in `App.tsx` clears it as soon as the backend recovers.

---

## 8. Data Fetching Hooks: `src/hooks/useGoldRates.ts`

Thin wrappers around TanStack Query. All API calls go through these hooks.

### `useLiveRates()`
- Fetches **all rates** from `/gold-rates/live` (no query params sent)
- Caches under key `['liveRates']`
- Re-fetches every 60 seconds (`refetchInterval: 60000`)
- Uses `placeholderData` to show previous data while re-fetching (no loading flash)
- Filters client-side by `selectedPurity` from the Zustand store
- Returns: `{ data: LiveRateResponse[], isLoading, isError, ...rest }`

### `useTodaySignal()`
- Fetches today's signal from `/signals/today`
- Cache key: `['todaySignal']`
- Re-fetches every 1 hour (`refetchInterval: 3600000`)
- Returns raw TanStack Query result

### `useMarketSummary()`
- Fetches UAE market summary from `/uaemarts/summary`
- Cache key: `['marketSummary']`
- Re-fetches every 5 minutes (`refetchInterval: 300000`)
- Returns raw TanStack Query result

---

## 9. Screens

### `HomeScreen.tsx`
**Purpose:** The main landing screen showing live gold rate cards for all regions at the selected purity.

**Data:** `useLiveRates()` — already filtered by `selectedPurity`

**Layout:**
- Hero section with "Global Rates" heading and a live indicator dot
- Purity filter buttons (24K / 22K / 18K) — clicking calls `setPurity()` on the store
- 3-column responsive grid of `<PriceCard />` components — one per region
- Bottom section: a news hero card (static, with `market_insight.png` background) and a recent alerts list (currently static mock data)

**Guards:**
- `isLoading === true` → Shows animated spinner with "Synchronizing Global Rates..." text
- `isError === true` → Shows "Failed to connect to the exchange" error message
- `rates.length === 0` → Shows "No rates found for selected purity" message

---

### `SignalScreen.tsx`
**Purpose:** Displays the AI-generated daily trading signal (BUY / WAIT / AVOID) with confidence, reasoning, and underlying metrics.

**Data:** `useTodaySignal()`

**Layout:**
- Large `<SignalBadge />` showing the signal type
- Confidence level display
- Full reasoning paragraph from the backend
- Metrics grid: current 24K price, 24h change, 7d trend, 30d trend, local premium
- Disclaimer text at the bottom

---

### `AlertsScreen.tsx`
**Purpose:** Allows users to subscribe to Telegram price alerts.

**Data:** Uses `api.subscribe()` directly with `useMutation` (TanStack Query)

**Form fields:**
- Telegram username (text input)
- Region selector
- Gold purity selector
- Alert frequency (Daily / Weekly / Instant)

**Behavior:** On submit, calls `api.subscribe()`. Displays success or error feedback inline.

---

### `UAEMarketScreen.tsx`
**Purpose:** Deep-dive analysis of the UAE gold market.

**Data:** `useMarketSummary()`

**Layout:**
- `<PremiumGauge />` showing the current UAE market premium %
- Best buy time card (day + time window + reason)
- Making charges table (per gram and per piece for each purity)
- VAT information section
- Premium trend indicator (increasing / decreasing / stable)

---

### `MaintenanceScreen.tsx`
**Purpose:** Full-page replacement shown when the backend is unreachable or returning 5xx errors.

**Data:** No API calls — purely static display

**Important:** All colors in this file are **absolute HEX values** (not CSS variables). This is intentional — it ensures the screen renders correctly even if the CSS theme fails to load.

**Layout:**
- Animated vault icon (SVG)
- "System Synchronization In Progress" heading
- Animated progress bar
- Status checklist (Exchange Feed, Signal Engine, Telegram Gateway, Premium Data Vault)
- "Force Synchronize" button — calls `window.location.reload()`
- "Background Auto-Sync Active (5s)" label

---

## 10. Components

### `PriceCard.tsx`
**Props:** `{ rate: LiveRateResponse }`

Displays one rate card for a region. Contains:
- Region name and flag/icon
- Currency symbol and current price per gram
- 24h change with color coding (green up, red down)
- Bid / Ask spread
- High / Low for 24h
- `<PriceChart />` sparkline at the bottom
- `cached` indicator if the data is from cache

---

### `PriceChart.tsx`
**Props:** `{ data?: number[] }`

A Recharts `AreaChart` sparkline. Currently receives no real historical data from the backend (the backend does not have a history endpoint). Renders empty or with mock data if none provided.

> ⚠️ **Known Gap:** This component has no real data source. It needs either mock data or a new backend `/price-history` endpoint.

---

### `PremiumGauge.tsx`
**Props:** `{ value: number; label: string }`

An SVG arc gauge rendered using calculated `stroke-dashoffset`. Shows the UAE premium percentage as a dial from 0–10%.

> ⚠️ **Known Gap:** Does not handle `undefined` or `null` value gracefully. If `UaeMarketSummary` hasn't loaded yet, the gauge should show a loading state.

---

### `SignalBadge.tsx`
**Props:** `{ signal: SignalType; size?: 'sm' | 'lg' }`

A pill badge with background color based on signal:
- `BUY` → Green
- `WAIT` → Amber
- `AVOID` → Red

---

## 11. Design System & Styling

### Design Assets

**Vault Texture** — Used as premium background overlay on hero sections:

![Vault Texture — metallic gold pattern](./assets/vault_texture.png)

**Market Insight Hero** — Used as blurred background on the HomeScreen news card:

![Market Insight — financial chart background](./assets/market_insight.png)

### CSS Architecture: `src/index.css`
Uses **Tailwind CSS v4** with the `@tailwindcss/vite` plugin. Tailwind v4 changes how theming works — instead of `tailwind.config.js`, all tokens are defined directly in CSS using `@theme`.

**Design Tokens (defined in `:root` / `@theme`):**

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#f2ca50` | Gold amber — buttons, accents, highlights |
| `--color-background` | `#0c1117` | Main page background |
| `--color-surface` | `#111827` | Card backgrounds |
| `--color-surface-container` | `#1a2233` | Nested card backgrounds |
| `--color-surface-container-low` | `#1f2a3c` | Input fields, secondary cards |
| `--color-on-surface` | `#e8e0c8` | Primary text (warm white) |
| `--color-on-surface-variant` | `#c4b99a` | Secondary text (muted parchment) |

**Typography:**
- Font family: **Inter** (loaded from Google Fonts in `index.html`)
- Financial numbers use CSS `font-variant-numeric: tabular-nums` for alignment

### Tailwind Utility Usage Pattern
Components use Tailwind utility classes directly in JSX. For conditional classes, a local `cn()` helper is used (defined per file using `clsx` + `tailwind-merge`):
```typescript
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 12. Vite Configuration: `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hqxlqr98-8001.inc1.devtunnels.ms',  // ← Update when tunnel URL changes
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'X-Tunnel-Skip-Anti-Phishing-Page': 'true',
        },
      },
    },
  },
})
```

**Proxy explained:** All requests from the browser to `/api/*` are intercepted by Vite's dev server and forwarded to the tunnel. This solves CORS (the browser only sees `localhost`) and anti-phishing (the header is added server-side).

> ⚠️ **The proxy ONLY works in development (`npm run dev`). In production, set `VITE_API_URL` to the full backend URL.**

---

## 13. Libraries

| Library | Version | Purpose |
|---|---|---|
| `react` | 19.x | UI framework |
| `react-dom` | 19.x | DOM rendering |
| `vite` | 8.x | Build tool + dev server |
| `typescript` | 5.x | Type checking |
| `@vitejs/plugin-react` | latest | JSX transform + HMR |
| `tailwindcss` | 4.x | Utility CSS |
| `@tailwindcss/vite` | 4.x | Tailwind v4 Vite integration |
| `axios` | latest | HTTP client |
| `@tanstack/react-query` | 5.x | Server state management, caching, refetch |
| `zustand` | 5.x | Global UI state |
| `clsx` | latest | Conditional class names |
| `tailwind-merge` | latest | Merge Tailwind classes without conflicts |
| `lucide-react` | latest | Icon library |
| `recharts` | latest | Chart components (AreaChart in PriceChart) |

---

## 14. Build & Run Commands

```bash
# Install dependencies
npm install

# Start development server (with proxy active)
npm run dev

# Type-check + build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 15. Environment Variables

| Variable | Required In | Description |
|---|---|---|
| `VITE_API_URL` | Production only | Full backend URL, e.g. `https://api.goldfield.app`. In dev, leave unset — defaults to `/api` proxy. |

Create a `.env.production` file:
```
VITE_API_URL=https://your-production-backend.com
```

---

## 16. How to Update This Document

Whenever code is changed, add or update the relevant section above. The rule is:

- **New file created** → Add to directory structure + add its section under Screens or Components
- **Existing file changed** → Update the relevant section (interface changed, new method added, etc.)
- **New library added** → Add to the Libraries table
- **Pending task completed** → Remove from workflow_documentation.md pending list
- **New pending task discovered** → Add to workflow_documentation.md pending list

This document + `workflow_documentation.md` together give complete context to resume work in any new conversation.
