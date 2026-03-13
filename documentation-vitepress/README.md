# B.A.G.E.L. documentation

This folder contains the [VitePress](https://vitepress.dev/) site for the B.A.G.E.L. language docs. The site is built and deployed to `/docs` on the main app’s S3 bucket.

- **Develop:** `npm run docs:dev` (from repo root) or `npm run docs:dev` here
- **Build:** `npm run docs:build` (from repo root) or `npm run docs:build` here

Output is in `docs/.vitepress/dist`. The deploy workflow copies it to `dist/docs` and syncs to S3.
