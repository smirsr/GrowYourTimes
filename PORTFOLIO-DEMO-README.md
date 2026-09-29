# GrowYourTime – Portfolio Demo

This copy is configured as a frontend-only Vite app for portfolio/demo use.

## Run locally

```bash
npm install
npm run dev
```

Open the localhost URL Vite prints in the terminal (usually http://localhost:5173).

## What changed

- Removed the runtime dependency on Express/PostgreSQL for the demo.
- Tasks, plants, and chat history are stored in the visitor's browser using localStorage.
- Task create/edit/delete/complete remains interactive.
- Completing tasks awards plant points.
- Plant care controls remain interactive and spend points.
- Carmelina runs in safe portfolio demo mode with local productivity/plant-care responses; no API key is exposed.
- Vite paths now match the actual project layout (`src/` at the repository root).

## Reset demo data

In the browser DevTools console, run:

```js
localStorage.removeItem('growyourtime_tasks');
localStorage.removeItem('growyourtime_plants');
localStorage.removeItem('growyourtime_chats');
location.reload();
```

## Build

```bash
npm run build
```

The static output is written to `dist/` and can be hosted on a static host such as GitHub Pages.
