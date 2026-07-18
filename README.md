# 🥤 Juice Delivery Driver App

A robust, cross-platform mobile application designed to streamline the daily operations of juice shop delivery drivers. Built on the modern React Native (Expo) ecosystem, this app facilitates real-time order tracking, intelligent georouting, and seamless state management to ensure optimal delivery workflows.

---

## 🏛️ System Architecture & Tech Stack

This project leverages a modern, decoupled architecture focusing on performance, reactivity, and type safety:

*   **Core Framework:** **React Native** via **Expo** (TypeScript enabled).
*   **Routing & Navigation:** **Expo Router** (File-system based routing leveraging Next.js-like paradigms).
*   **State Management:** **Zustand** (A small, fast, and scalable barebones state-management solution using simplified Flux principles).
*   **Asynchronous State / Data Fetching:** **TanStack Query (React Query)** (Handles caching, background updates, and stale data synchronization).
*   **List Virtualization:** **`@shopify/flash-list`** (Optimized list rendering, significantly outperforming native `FlatList` in FPS and memory consumption for large datasets).
*   **Native Interop:** **`expo-linking`** (For bridging deep links into OS-level applications).

---

## ✨ Core Technical Features

### 1. Reactive Order Pipeline (`useQuery` + Zustand)
*   **State Synchronization:** The `HistoryScreen` utilizes an reactive query key `['orders-history', selectedStatus]` within `useQuery`. This creates a declarative data-fetching model where mutating the local `selectedStatus` state automatically invalidates the cache and triggers a re-fetch of the specific dataset (Completed `[5]` or Rejected `[4]`) without manual `refetch()` invocations.
*   **Global Payload Handling:** Selecting an order dispatches the entire `Order` object to the Zustand store via `setSelectedOrder(order)`, ensuring complex nested data is immediately available to the detail route `/order/[id]` without redundant network requests or prop drilling.

### 2. Intelligent Deep-Link Navigation Strategy
*   **Intent Resolution:** The application implements a tiered fallback mechanism for launching external navigation.
*   **Tier 1 (Native Navigation Intent):** Attempts to invoke `google.navigation:q={lat},{long}`. If the native Google Maps package is registered on the OS, it bypasses the search UI and instantly launches turn-by-turn navigation.
*   **Tier 2 (Web/Browser Fallback):** If the native intent fails (`Linking.canOpenURL` returns false), it gracefully falls back to a constructed HTTP intent (`https://www.google.com/maps/dir/?api=1&destination={lat},{long}`), ensuring continuous operability across different device configurations.
*   **Tier 3 (Geocoding Fallback):** If coordinate data is missing, it constructs an encoded string query against the Google Maps Search API using the text-based address.

### 3. Optimized UI/UX Engineering
*   **Fluid Layouts:** Implementation of a continuous visual theme (e.g., `#267a75` toolbar merging into a `#f9f9f9` content container) utilizing `borderTopLeftRadius` and `borderTopRightRadius` on nested views.
*   **Flexbox Precision:**
    *   **50:50 Split Views:** The history filter utilizes `width: '100%'` on the parent container and `flex: 1` on child `TouchableOpacity` components, guaranteeing mathematically perfect division of screen real estate regardless of device width.
    *   **Content Alignment:** Strategic use of `justifyContent: 'space-between'` and `alignItems: 'center'` ensures exact positioning of dynamic text bounds (e.g., preventing lengthy item names from overflowing into status badges).
*   **Scroll Mechanics:** Leveraging `contentContainerStyle` for list padding within `FlashList` to prevent clipping artifacts when scrolling content under rounded corner overlays.
*   **Native OS Polishing:** Suppression of default OS header elevations and shadows using `headerShadowVisible: false` and `elevation: 0` in Expo Router's `screenOptions`.

---

## 🛠️ Development Setup

### Prerequisites
*   Node.js (LTS recommended)
*   Yarn or npm
*   Expo CLI (`npm install -g expo-cli`)

### Initialization
```bash
# 1. Clone repository
git clone <repository-url>

# 2. Install dependencies
npm install

# 3. Synchronize TypeScript configuration
npx expo opt-in-ts

# 4. Start the bundler (with cache reset)
npx expo start -c
```

## 📂 Project Structure Highlights

```text
src/
├── app/                  # Expo Router file-based routing
│   ├── (tabs)/           # Main navigation tabs (Home, History, Profile)
│   │   ├── _layout.tsx   # Tab configuration & styling (headerShadowVisible: false)
│   │   ├── index.tsx     # Active orders view
│   │   └── history.tsx   # Reactive history view with 50:50 status filters
│   └── order/            # Dynamic routes
│       └── [id].tsx      # Order detail view (hydrated via Zustand)
├── components/           # Reusable UI components
│   └── OrderCard.tsx     # Flexbox-optimized card with deep-link navigation
├── features/             # Feature-sliced domain logic
│   └── orders/
│       ├── api/          # Data fetching logic & types (Order interface)
│       └── store/        # Zustand state definitions (useOrderStore)
```

## 📹 Screen Recording

- https://drive.google.com/file/d/1NcNJgwTgVPcYhQ21qkClVIy1ZV0Kma5-/view?usp=sharing