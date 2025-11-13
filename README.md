# AI Underwriter Plus

A dark-mode underwriting cockpit for Justin Homebuyer that mirrors ChatARV flows while layering strict comp rules, rehab estimating, and a lightweight pipeline.

## Getting started

1. Copy `.env.example` to `.env.local` and adjust settings.
2. Install dependencies.
   ```bash
   npm install
   ```
3. Run the dev server.
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to access:
   - `/` — Ops console with dossier/comps/rehab form calls
   - `/property/JUSTIN-123` — Dossier + comps tabs with adjustments + MAO calculator
   - `/pipeline` — Lead status board

## Tech stack
- Next.js 14 (App Router + typed routes)
- TypeScript + strict mode
- TailwindCSS with branded tokens

## API surface
The UI calls three mocked endpoints that will later be swapped for Postgres-backed services:

- `POST /api/dossier` — owner, liens, mortgages, assessments
- `POST /api/comps` — strict + smart comps with adjustment metadata
- `POST /api/rehab` — Lite/Mid/Full ranges plus line items

All responses live in `data/mock.ts` for now so the app stays pure and typed.
