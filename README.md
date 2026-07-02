# shahzaib.rizvi — portfolio

Personal portfolio of Syed Shahzaib Haider Rizvi, AI engineer and full-stack developer.

Hand-built with a 3D WebGL particle hero, generative canvas artwork per project, and scroll-driven motion. No templates, no stock imagery.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Three Fiber (hero particle field)
- Motion (scroll reveals and entrances)
- Space Grotesk + JetBrains Mono, self-hosted via Fontsource

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

The repo is configured for Vercel via `vercel.json` (framework `vite`, output `dist`). Two ways to ship it:

- **Dashboard:** import the repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects the Vite settings; just click Deploy. Every push to `main` then deploys automatically.
- **CLI:** `npm i -g vercel`, then `vercel` (preview) or `vercel --prod` (production) from the project root.

No base-path override is needed. The site serves from the domain root.
