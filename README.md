# TIGA Biz Centre

Responsive, server-rendered website based on the approved emerald, ivory and gold designs. Seven main pages, twelve English service pages, four Bahasa Malaysia service editions and two project case studies: 25 pages with original extracted illustrations, self-hosted fonts, accessible navigation, filters and WhatsApp enquiries.

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

The live domain is **https://www.tigabizcentre.com/** and the Worker name is `tiga-biz-centre`. `wrangler.jsonc` sets `SITE_URL` to that HTTPS origin. Keep the apex and www domains connected to this Worker: HTTP, the apex domain and the Workers subdomain permanently redirect to HTTPS www, preserving paths and query parameters. Canonicals, Open Graph, structured data, robots.txt and sitemap.xml use the configured origin. Local preview remains available on its own origin when `SITE_URL` is unset.

Clean routes such as `/about` and `/services` are configured. `.html`, `/index.html` and trailing-slash variants redirect. Missing pages return a real 404. This is a multi-page static site, not an SPA fallback.

Cloudflare reference: [static asset configuration](https://developers.cloudflare.com/workers/static-assets/binding/) and [HTML URL handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).

## Business content

- Phone and WhatsApp: **01161283216**, international **+60 11-6128 3216**.
- Fully online throughout Malaysia, especially Sabah and Sarawak.
- Email: tigabizcentre@gmail.com. Phone and WhatsApp remain active.
- The website uses TIGA-only branding, with all 21 portfolio entries retained.
- The contact form prepares a WhatsApp message. The visitor reviews and sends it in WhatsApp. No message is sent automatically; no form database or file upload exists.

Edit `src/data.mjs` for business details and service content, `src/pages.mjs` for templates, and `public/styles.css` for styling. The form uses its rendered business-number attribute rather than a separate hardcoded destination.

## Artwork and typography

The supplied artwork was reused and extracted, including logo, all seven hero illustrations, service/process icons and background textures. WebP encoding is lossless; background isolation is a separate editing operation. No new GPT-Image-2 generation was needed or performed in this implementation. Extracted raster assets cannot acquire detail beyond their original resolution.

Plus Jakarta Sans and Inter are self-hosted visual matches; the source artwork did not include font files. Typography intentionally grows with screen width. Main body sizing is 18 px on phones/tablets, approximately 25 px at 1440 px, and 42 px at 2560 px. Supporting labels vary. A persistent A+ control increases reading text. Larger text and updated business copy make some sections taller than the original artwork.

`public/assets` contains deployment-ready assets and font licences. `scripts/extract-assets.mjs` is an optional authoring script using the original numbered PNG references in the parent folder. It is not needed to build or deploy. `scripts/visual-report.mjs` likewise uses the separately delivered references and browser screenshots.

## Service-page layout

All twelve service pages use a compact checklist grid and a content-sized preparation panel. Original illustrations balance the header. The preparation link selects the service on the contact form. Spacing has also been tightened on Home, Contact, Our Process and Portfolio. The follow-up audit covers all nineteen routes and 81 viewport/text-size combinations; see `docs/visual-review/spacing-checks.json`.

## Verification

See `docs/validation.txt`, `docs/design-audit.txt`, `docs/visual-review/`, and `docs/seo-competitor-research.txt`.

The build and twelve automated test groups pass locally, including GTM production-only loading, all 25 routes, language alternates, FAQ/schema parity, case studies, production canonical redirects and local-preview access. Earlier browser checks cover filters, FAQ expansion, mobile navigation, text-size controls and form validation. Screenshots cover all seven approved pages at 390, 768, 1024, 1440 and 2560 px; no horizontal overflow or missing images was detected. Exact pixel identity is not claimed.

GitHub Actions passed dependency installation, build, all six test groups and the Wrangler deployment dry-run on Linux: [successful check](https://github.com/syafiqapextreasure/tiga-biz-centre/actions/runs/41582220545). The local Windows sandbox blocks esbuild child processes, so the Linux check supplies the deployment validation. No Cloudflare account deployment has been performed.


## Content migration audit

The portfolio now preserves all 21 original Cosmos references (7 recruitment, 6 documentation, 8 training/CSR), including full project details and searchable sector/location fields. About restores the original profile’s three people, five reported metrics and four group entities with historical attribution. All twelve service pages include fuller descriptions; Services restores six historical capability areas and four preparation groups. Current TIGA contact details and Malaysia-only coverage remain unchanged. Historical overseas references do not expand current service coverage.

See [the source reconciliation](docs/content-migration-audit.txt) and [37 responsive checks](docs/content-responsive-checks.json). The original EN/BM toggle has not been ported; the restored content is in English.

### About page visibility correction (4 November 2026)

The three profile people, five experience figures and four group entities now appear as visible About sections before the final contact prompt. All four source objectives and the fuller background are restored. Quick links lead to each main section. Ten layout checks cover 320–2560 px in standard and A+ text modes; see `docs/about-content-review.txt` and `docs/about-responsive-checks.json`.

## TIGA branding update (4 November 2026)

At the owner’s request, all public legacy brand mentions, source labels, original-profile notices, old group-entity names and links have been removed. About, Services and Portfolio now use TIGA wording, including page titles and descriptions. The old email was removed from visible links and structured data pending a replacement address. This update supersedes the historical attribution approach documented in earlier audits. All 19 pages are checked for legacy-brand leakage; eight test groups and ten browser checks pass.

Confirmed contact email (4 November 2026): `tigabizcentre@gmail.com`, used on Contact, Our Process and the business structured data.

## Custom-domain SEO audit (9 November 2026)

All 19 original live pages were checked. The update consolidates public host/protocol variants, adds specific descriptions for all 12 services and sharpens three priority service titles. See [the SEO/AEO/GEO audit and keyword priorities](docs/live-seo-audit-2026-11-09.txt) and [the Search Console and GA4 setup guide](docs/google-setup-guide.txt). The later GTM installation below supersedes the initial audit's tracking-installation gap. No ranking, indexing-speed or AI-citation guarantee is made.

## Service answers, translations and case studies

The subsequent content update expands all 12 service pages with practical answers and related-service links. Four priority services have Bahasa Malaysia editions with reciprocal language links, and two existing portfolio records have dedicated case studies. The sitemap now lists 25 pages. See [the content update and validation](docs/seo-content-update-2026-11-09.txt). Maintain English guidance in `src/service-guides.mjs`, translations in `src/locales.mjs` and case-study presentation in `src/case-studies.mjs`; project facts remain in `src/profile.mjs`.

## Google Tag Manager

Container `GTM-M3KKB945` loads on production HTML through `public/tag-manager.js`, injected by the Worker near the start of the head. The noscript iframe follows the opening body tag. Local development does not load tracking. The loader queues the standard GTM start event before loading the container, with no duplicate direct GA installation. The published container returned HTTP 200 and contained GA4 ID `G-Y48STDP5G1` during setup; confirm event receipt in that property's Realtime report.

The CSP allows Google Tag Manager and basic Analytics resources, without enabling inline JavaScript or unsafe-eval. Manage tags in GTM; additional advertising or custom HTML tags may need a separate review of their resource requirements. Before enabling automatic outbound/form tracking, ensure it cannot send WhatsApp message query strings or user-entered contact data. The website does not add form values to the data layer. GTM container changes are managed separately from this repository.
