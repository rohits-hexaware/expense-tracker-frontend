# Expense Tracker Frontend

A simple React expense tracker UI that connects to the **ExpenseTracker-Backend** REST API.

## Features

- Add, edit, and delete expenses
- Category selection (auto-seeds default categories on first run)
- Monthly spending summary with month/year filters
- Responsive layout with a clean dark theme

## Prerequisites

- Node.js 18+
- ExpenseTracker-Backend running on `http://localhost:8080`

## Getting Started

```bash
cd ExpenseTracker-Frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Proxy

During development, Vite proxies `/api` requests to the backend at `http://localhost:8080` (see `vite.config.js`).

## GitHub Pages deployment

Uses the official GitHub Actions Pages workflow (`.github/workflows/static.yml`).

**One-time repo setup (required):**

1. **Settings → Actions → General → Workflow permissions** → **Read and write permissions** → Save
2. **Settings → Pages → Build and deployment** → **Source: GitHub Actions** → Save

Live site: `https://rohits-hexaware.github.io/expense-tracker-frontend/`

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |

## Tech Stack

- React 19
- Vite 6
- Plain HTML & CSS (no UI framework)
