# Expense Tracker PWA

A minimal Progressive Web App for tracking expenses. Connects to the backend API and supports offline usage.

## Quick Start (Local)

1) Prereqs: Node 18+, npm 9+

2) Install deps:
```bash
npm install
```

3) Configure environment (`.env` at project root):
```env
REACT_APP_BACKEND_HOST=http://localhost:3001
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=replace_me
```

4) Run:
```bash
npm start
```
App: http://localhost:3002

## Features
- **Auth0 authentication**
- **Household selection** via `X-Household-Id` header (synced globally)
- **Expenses, categories, subcategories** UI
- **PWA** with service worker

## Scripts
- `npm start` — Dev server on port 3002
- `npm run build` — Production build in `build/`
- `npm test` — Tests
- `npm run lint:fix` — ESLint + Prettier

## Project Structure
```
src/
  App.tsx                App shell, theming, routes
  components/            UI components
  hooks/                 React hooks (e.g., useHouseholds)
  services/              API client (`api.ts`) with global headers
  store/                 Redux store and slices
  styles/                Theming and global styles
```

## Deployment (Railway)

UI is deployed on Railway under project `expense-tracker` with two environments: `staging` and `production`.

- Service name: `UI`
- Staging domain: managed by Railway (e.g. `ui-staging-xxxx.up.railway.app`)
- Production domain: managed by Railway (e.g. `ui-production-xxxx.up.railway.app`)

### Environment Variables (Railway)

Required variables per environment:

- `REACT_APP_API_URL` — Backend base URL
- `REACT_APP_AUTH0_DOMAIN`
- `REACT_APP_AUTH0_CLIENT_ID`
- `REACT_APP_AUTH0_AUDIENCE`
- `CI=false` — to avoid CRA failing on warnings in CI

Local dev uses `.env` (not committed).

### CI/CD

GitHub Actions workflow: `.github/workflows/deploy-ui.yml`

- Branch `main` → production
- Branches `feature/**` → staging
- Workflow dispatch allows manual environment selection

Required repo secret:

- `RAILWAY_TOKEN` — Railway account token
- Optional `UI_SMOKE_URL` — URL to curl after deploy

### Promotion flow

1. Push to `feature/*` → auto-deploy to `staging`.
2. Validate staging (UI loads, Auth0 login, API calls OK).
3. Merge to `main` → auto-deploy to `production`.

## Notes
- Backend base URL is taken from `REACT_APP_BACKEND_HOST` for local dev and `REACT_APP_API_URL` for Railway.
- The active household is stored in `localStorage` (`active_household_id`) and sent as `X-Household-Id`.

## License
MIT