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

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with `--base=/portfolio/` and publishes to GitHub Pages. One-time setup: in the repo settings, set **Pages → Source → GitHub Actions**.
