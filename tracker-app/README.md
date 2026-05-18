# ◈ Subscriptions Tracker
A beautifully designed, local-first web application for managing all of your recurring subscriptions, predicting upcoming renewals, and visualizing your spending habits.

![Screenshot representation: A modern dark-mode UI with sleek stat tracking, a sidebar, and multi-currency formats]

## Overview
Built originally as a lightweight port from an AI-generated template, Subscriptions Tracker has evolved into a fully functional, highly responsive, production-ready React web app. It is entirely self-contained, meaning **your data never leaves your device** unless you explicitly export it.

## Key Features
* 🔒 **Local-First Architecture:** Utilitizes browser LocalStorage. No databases, zero tracking, and no login tokens required to use.
* 💸 **Multi-Currency Support:** Accurately renders distinct currency symbols ($, €, £) across the Dashboard and ListView natively depending on the subscription logic.
* 📦 **Data Portability:** Take control of your data via the native **Export / Import** `.json` capabilities. Back up your info securely to your hard drive, or migrate your exact UI state seamlessly across devices!
* 📅 **Monthly Tracking Grid:** Track precisely which months you paid for a subscription versus when it was paused using a Github-style 12-Month visual checkerboard grid directly on the list-view row.
* 🔗 **Renewal Hotlinks:** Click instantly on a subscription name to navigate externally to the exact URL mapped for bill renewal or service adjustments.
* 📱 **Portrait & Mobile Responsive:** Advanced flex layouts ensure the Dashboard stats and list actions reflow perfectly down to narrow iPhone dimensions!

## Technology Stack
- **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS leveraging CSS Modules & responsive flexbox grids.
- **Fonts**: Curated Google Fonts (`Sora` for headers/UI, and `DM Mono` for numerical values).

## Getting Started

To spin up the application on your own local device:

1. **Install Dependencies**
```bash
npm install
```

2. **Run the Development Server**
```bash
npm run dev
```

3. **Build for Production**
```bash
npm run build
```

_The application utilizes strict TypeScript compiler checking and heavily guarded ESLint validation ensuring component and state stability natively._
