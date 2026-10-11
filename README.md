# Nishtha and Aseem's Wedding

A wedding invitation with a playful RSVP, three questions for guests, and celebration details.

## Run locally

Requires Node.js 22 or 24 and pnpm (the version is pinned in `package.json`).

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173/.

## Publish

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` checks, builds, and publishes the wedding website to GitHub Pages whenever changes are pushed to `main`. The repository's Pages source must be set to **GitHub Actions**.

The build reads its base path from GitHub Pages and includes entry files for the RSVP routes, so direct links and refreshes work on both the GitHub address and a custom domain.

## Check and build

```sh
pnpm --filter @workspace/wedding-website run typecheck
PORT=5173 BASE_PATH=/NishthaAseemShaadi/ pnpm --filter @workspace/wedding-website run build
```

The deployable files are written to `artifacts/wedding-website/dist/public`.
