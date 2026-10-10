# Day Trip AI — React Frontend Application

[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![React Router 6](https://img.shields.io/badge/React%20Router-6.26-ca4245.svg)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.7-5a29e4.svg)](https://axios-http.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide%20React-0.446-f97316.svg)](https://lucide.dev/)

Modern, responsive client interface for the **Day Trip AI** smart one-day travel discovery and itinerary orchestration platform.

---

## 🌟 Application Features

- **Multi-Page Routing**: Clean navigation across Home (`/`), Catalog (`/destinations`), Planner (`/trips`), and Saved Bookmarks (`/favorites`).
- **Global JWT AuthContext**: Seamless session restoration from `localStorage`, Bearer token interceptor, and one-click demo credentials for Alex Traveler and System Admin.
- **Destination Discovery**: Real-time keyword search, multi-category filtering (`HERITAGE`, `NATURE`, `FOOD`, etc.), and sorting by cost or ratings.
- **Trip Planning Workspace**: Interactive trip creation with budget allocation, pacing preferences (`RELAXED`, `BALANCED`, `FAST_PACED`), and destination checklists.
- **Itinerary Timeline**: Chronological stop sequence, drag-and-drop / arrow reordering, meal stop insertion, and transit hops.
- **Expense Manager**: Live financial tracking, category breakdowns, and over-budget warnings.
- **Geospatial Route Navigator**: Multi-modal transit computation (Cab, Metro, Walking) with Haversine distance and fare estimations.
- **Meteorological Forecasts**: Hourly temperatures, weather conditions, rain risk probabilities, and AI packing advice via Open-Meteo REST service.
- **AI Travel Studio**: Custom generation prompts orchestrated with Google Gemini 1.5 Flash and OpenAI GPT-4o Mini.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router DOM 6.26
- **HTTP Client**: Axios with JWT request/response interceptors
- **Icons**: Lucide React
- **Design Tokens**: Pure CSS variables and responsive flex/grid layouts

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm installed

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Starts local development server at **`http://localhost:5173`**.

### Production Build
```bash
npm run build
npm run preview
```
Production assets are output to `dist/`.
