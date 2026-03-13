# frontend

This directory contains the Next.js frontend for `mo-stripe`.

For the full project overview, setup instructions, architecture notes, and API summary, see the root [README](../README.md).

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Environment

Create `frontend/.env.local`:

```env
AUTH_API_URL=http://localhost:4000
```

`NEXT_PUBLIC_AUTH_API_URL` is still supported as a fallback, but `AUTH_API_URL` is preferred now that the frontend proxies auth and account writes through same-origin `/api` routes.
