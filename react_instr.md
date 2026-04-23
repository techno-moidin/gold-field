# Technical Hand-off: Gold Field React Frontend Implementation

This document provides a technical roadmap for implementing the Phase 1 designs ({{DATA:SCREEN:SCREEN_6}}, {{DATA:SCREEN:SCREEN_4}}, {{DATA:SCREEN:SCREEN_7}}, {{DATA:SCREEN:SCREEN_8}}) using React and Tailwind CSS.

## 1. Project Architecture & Stack

- **Framework**: Next.js (App Router recommended) or Create React App.
- **Styling**: Tailwind CSS (Critical for matching the utility-first approach of the designs).
- **Icons**: Lucide React or Google Material Symbols.
- **Charts**: Recharts or ApexCharts (best for the "Price History" and "Sparkline" components).
- **State Management**: React Context or TanStack Query (for fetching and caching live gold rates).

---

## 2. Global Styling (Design System: Aurum Ledger)

Ensure your `tailwind.config.js` is configured with the following theme values derived from the design system:

### Colors
- **Primary (Gold)**: `#D4AF37`
- **Background**: `#0F172A` (Slate 950)
- **Surface (Card)**: `#1E293B` (Slate 800)
- **Success (Up)**: `#22C55E`
- **Error (Down)**: `#EF4444`

### Typography
- **Font Family**: 'Inter', sans-serif.
- **Price Large**: `text-4xl font-bold tracking-tight`.

---

## 3. Component Breakdown

### A. Shared Layout Components
1. **`SideNavBar`**: (Desktop) Fixed sidebar with navigation links and 'Trade Now' CTA.
2. **`BottomNavBar`**: (Mobile/Tablet) Sticky navigation for touch devices.
3. **`PriceCard`**: Reusable grid item showing Region, Price, and 24h Change %.

### B. Feature-Specific Components
1. **`PriceChart`**: A responsive line chart using a gold stroke and a subtle gradient fill.
2. **`SignalBadge`**: A dynamic component that changes color based on status (BUY/WAIT/AVOID).
3. **`PremiumGauge`**: A custom SVG-based indicator for the UAE Market screen.

---

## 4. Implementation Workflow Suggestions

To communicate with your frontend or AI agent efficiently without using specific editors:

### Method 1: The "View Code" Bridge (Recommended)
1. **Get the Code**: For any screen I've designed, click the **</> View Code** button in the Stitch toolbar.
2. **Copy/Paste**: Copy the HTML/Tailwind and paste it into a React component.
3. **AI Refactoring**: If you use an AI editor like **Cursor** or **GitHub Copilot**, you can paste the raw HTML and say: *"Convert this HTML into a reusable React component using Tailwind CSS."*

### Method 2: Figma Export
- Use the **Export to Figma** button in my toolbar. Many AI agents and developers prefer reading Figma files to understand spacing and typography tokens precisely.

### Method 3: JSON Component Specs
- I can provide JSON definitions of the components (like the `COMPONENTS` object in my DataStore) which you can feed into your AI agent to generate the underlying boilerplate code.

---

## 5. Responsive Strategy
- **Mobile First**: Start by implementing the narrowest view. Use Tailwind's `md:` and `lg:` prefixes to add columns and show/hide the sidebar as the screen grows.
- **Grid Layouts**: Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for the price grid on the Home screen.

---
*Prepared by Stitch AI*