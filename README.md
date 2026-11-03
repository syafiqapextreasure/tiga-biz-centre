# TIGA Biz Centre

Responsive, server-rendered website based on the approved emerald, ivory and gold designs. Seven main pages and twelve service detail pages, with original extracted illustrations, self-hosted fonts, accessible navigation, filters and WhatsApp enquiries.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run build
npm test
npm run dev
```

The default preview is http://127.0.0.1:4173. Set `PORT` to use another port. The preview runs the same request handler as the Worker.

## Deploy to Cloudflare Workers

Connect this repository to a **Worker** in Cloudflare Workers & Pages. Use the repository root, branch `main`, build command `npm run build`, and deploy command `npx wrangler deploy`. Cloudflare installs dependencies from the lockfile. `wrangler.jsonc` configures both the Worker and its `dist` static assets.

Alternatively, after signing into your Cloudflare account locally:

```sh
npm ci
npm run deploy
```

The default Worker name is `tiga-biz-centre`. Add your custom domain in the Worker settings. Optionally set the runtime variable `SITE_URL` to your preferred HTTPS origin, such as `https://your-final-domain.com`. If omitted, canonical URLs, Open Graph URLs, structured data, robots.txt and sitemap.xml use the incoming request origin. A final domain has not been supplied; no invented domain is configured.

Clean routes such as `/about` and `/services` are configured. `.html`, `/index.html` and trailing-slash variants redirect. Missing pages return a real 404. This is a multi-page static site, not an SPA fallback.

Cloudflare reference: [static asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/) and [HTML URL handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).

## Business content

- Phone and WhatsApp: **01161283216**, international **+60 11-6128 3216**.
- Fully online throughout Malaysia, especially Sabah and Sarawak.
- Email retained from the supplied source: cosmosventurekk@gmail.com.
- Portfolio entries remain explicitly attributed historical Kosmos Group references.
- The contact form prepares a WhatsApp message. The visitor reviews and sends it in WhatsApp. No message is sent automatically; no form database or file upload exists.

Edit `src/data.mjs` for business details and service content, `src/pages.mjs` for templates, and `public/styles.css` for styling. The form uses its rendered business-number attribute rather than a separate hardcoded destination.

## Artwork and typography

The supplied artwork was reused and extracted, including logo, all seven hero illustrations, service/process icons and background textures. WebP encoding is lossless; background isolation is a separate editing operation. No new GPT-Image-2 generation was needed or performed in this implementation. Extracted raster assets cannot acquire detail beyond their original resolution.

Plus Jakarta Sans and Inter are self-hosted visual matches; the source artwork did not include font files. Typography intentionally grows with screen width. Main body sizing is 18 px on phones/tablets, approximately 25 px at 1440 px, and 42 px at 2560 px. Supporting labels vary. A persistent A+ control increases reading text. Larger text and updated business copy make some sections taller than the original artwork.

`public/assets` contains deployment-ready assets and font licences. `scripts/extract-assets.mjs` is an optional authoring script using the original numbered PNG references in the parent folder. It is not needed to build or deploy. `scripts/visual-report.mjs` likewise uses the separately delivered references and browser screenshots.

## Verification

See `docs/validation.txt`, `docs/design-audit.txt`, `docs/visual-review/`, and `docs/seo-competitor-research.txt`.

The build and six automated test groups pass locally. Browser checks cover filters, FAQ expansion, mobile navigation, text-size controls and form validation. Screenshots cover all seven approved pages at 390, 768, 1024, 1440 and 2560 px; no horizontal overflow or missing images was detected. Exact pixel identity is not claimed.

The local Windows sandbox prevents Wrangler's esbuild child process from starting (`spawn EPERM`), so local Wrangler dry-run validation is incomplete. The included GitHub Actions workflow performs build, tests and Wrangler dry-run in Linux without deploying. No Cloudflare account deployment has been performed.

