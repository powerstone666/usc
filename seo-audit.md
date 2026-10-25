# SEO Audit: Urban Service Company

Scope: search engine optimisation only. Security and code-quality findings are excluded.
Method: read-only review of the source by four audit passes (global plumbing, static and service pages, dynamic routes and blog, crawlability). No live crawl, Lighthouse run or Rich Results test was performed, so findings are based on code and should be confirmed in Search Console after changes.

## Summary

- Indexable dynamic URLs: **868**, all listed in the sitemaps.
- Most serious risk: templated pages that differ only by area, brand or keyword name, which look like doorway pages to Google.
- Quick wins: placeholder phone number, admin pages not excluded from crawling, over-long titles, sitemap dates.

## Critical

### 1. Templated area × service pages (510 URLs)
- `app/(site)/areas/[area]/[service]/page.tsx:15-23`
- `app/sitemap-areas.xml/route.ts:14-22`

The body (problems, FAQs, tips) is identical for every area. Only the area name, heading and the nearby-links list change.

**Fix:** noindex the combinations, or generate only the areas actually served. Remove the rest from the sitemap.

### 2. Templated brand × service pages (180 URLs)
- `app/(site)/brands/[brand]/[service]/page.tsx:15-23`
- `app/sitemap-brands.xml/route.ts:17-24`

The brand name is the only variable. Several brands (Mi, AmazonBasics, Videocon, Onida, Sansui, Cello) may not be serviced.

**Fix:** noindex, or keep only brands with real, brand-specific content and confirmed service.

## High

### 3. Keyword pages are permutations with duplicate bodies (51 URLs)
- `app/(config)/keywords.ts`
- `app/(site)/keywords/[keyword]/page.tsx:91-102`

Only about 20 distinct bodies exist across 51 pages. Sixteen microwave pages share one body, and the "How we fix it" block is identical on all of them. Titles are word permutations such as "Oven Repair Near Me" and "Microwave Repair Shop Near Me".

**Fix:** keep one canonical page per problem, noindex the permutations, and add unique per-problem content.

### 4. "Urban Company" used in keyword titles and copy
- `app/(config)/keywords.ts:49-62`
- `app/(site)/keywords/[keyword]/page.tsx:28, 67`

Titles such as "Urban Company … in Bengaluru" and "Alternative to Urban Company" are used, but the body never mentions the competitor. The comparison page contains generic microwave copy. This is a search-intent mismatch and a trademark risk.

**Fix:** remove these entries and routes, or write accurate comparison content after trademark review.

### 5. Placeholder phone number in structured data and on the page
- `app/(config)/site.ts:8-13` (marked `TODO(replace-before-launch)`)
- `app/layout.tsx:115` (emitted as `telephone` in Organization JSON-LD)
- Service pages emit it as `provider.telephone`.

**Fix:** replace with the real number before launch, and add a build check that fails if the TODO remains.

### 6. Footer call button has no visible text; contact page value is empty
- `app/(ui)/components/footer.tsx:~107`
- `app/(site)/contact/page.tsx:60-62`

Crawlers and screen readers get no phone number or accessible name.

**Fix:** render `site.phoneDisplay` in both places, and add `aria-label` to the icon-only button.

### 7. Admin pages are crawlable and indexable
- `app/robots.ts:5-11` (no disallow for `/admin` or `/api`)
- `app/admin/layout.tsx` and `app/admin/login/page.tsx` (no robots metadata)
- `next.config.ts:12-13` (X-Robots-Tag only on `/api/:path*`)

**Fix:** add `disallow: ["/admin", "/api"]` to `robots.ts`, add `robots: { index: false, follow: false }` to the admin layout, and add an X-Robots-Tag header for `/admin/:path*`.

### 8. Titles exceed snippet length because of the layout suffix
- Root template appends " · Urban Service Company" (25 characters), set in `app/layout.tsx`.
- Service pages: base titles 57-66 characters, so 82-91 in search results (`app/(site)/services/*/page.tsx:18-30`).
- Keyword pages: up to about 107 characters (`app/(site)/keywords/[keyword]/page.tsx:28`). The service name also doubles on AC pages ("AC Repair & Service Service").
- Blog posts: 55-68 characters plus suffix, about 95 (`app/(site)/blog/[slug]/page.tsx:26`, `app/(config)/blog.ts`).

**Fix:** keep base titles to about 45-50 characters, add a short-title field for keywords and blog posts, or use `title.absolute` where the suffix is not wanted.

### 9. Homepage has no page-specific metadata
- `app/(site)/page.tsx:17` has no `metadata` export and inherits the root title and description.
- The root description in `app/layout.tsx:22-23` is about 190 characters.

**Fix:** add a homepage title and a description of 120-160 characters.

### 10. Service pages have near-identical body copy
- Sections repeated across all six service pages: `WhyChooseUs`, `HowItWorks`, `BrandsGrid`, `ServiceAreas` (same `popularAreas`), `TipsSection`.
- FAQ template: "starts with a free diagnosis" (`app/(config)/content.ts` lines 116, 166, 216, 266, 300).
- Quality-assured answers repeated (lines 152, 202, 248, 294).
- "Microwave-first specialists" card renders on AC, chimney, fridge, washing-machine and water-filter pages (`app/(config)/content.ts:507-514`, `app/(ui)/components/why-choose-us.tsx`).

**Fix:** write per-service process and FAQ copy, and make the "why" section service-specific.

## Medium

### 11. Sitemap dates and frequency carry no signal
- `app/sitemap.xml/route.ts:5`, `app/sitemap-static.xml/route.ts:9-20`, and the services, areas, brands, keywords and blog sitemaps all set `lastmod` to build or request time and `changefreq` to "daily".

**Fix:** use real content modification dates (blog already has them), or omit `lastmod` and `changefreq`.

### 12. Keyword sitemap lists near-duplicate pages at priority 0.5
- `app/(config)/keywords.ts`, via `app/sitemap-keywords.xml/route.ts:13-15`.
- Sixteen entries share the "Microwave not heating" problem, and the AC near-me pages share "AC not cooling".

**Fix:** consolidate duplicates and remove the weaker ones from the sitemap.

### 13. Brand sitemap includes low-profile brands
- `app/sitemap-brands.xml/route.ts:14-22`: 30 brands × 7 URLs, about 210 URLs.

**Fix:** restrict to brands with real service coverage.

### 14. Service and brand descriptions too long
- Service-page descriptions run 166-195 characters (e.g. `app/(site)/services/microwave-repair/page.tsx:21`).

**Fix:** trim to about 150 characters.

### 15. Blog structured data and metadata are incomplete
- `app/(site)/blog/[slug]/page.tsx:59-69`: Article author is an Organization, with no image, `dateModified` or `mainEntityOfPage`.
- `app/(site)/blog/[slug]/page.tsx:29-33`: Open Graph has no image.

**Fix:** add a Person author (or an author entity), image, `dateModified`, `mainEntityOfPage`, and an OG image.

### 16. FAQ answers duplicated within blog posts
- `app/(site)/blog/[slug]/page.tsx:54, 130-134`: the FAQ accordion is built by splitting body paragraphs on "?", so answers appear verbatim in the article.

**Fix:** write separate FAQ content, or drop the duplicated paragraphs.

### 17. FAQPage schema reused on templated pages
- `app/(ui)/components/faq-section.tsx:20` emits the same six `serviceFaqs` on every area, brand, keyword and near-me page.

**Fix:** keep FAQPage only where FAQs are unique, or noindex the templated pages.

### 18. "Nearby areas" links are not geographic
- `app/(site)/areas/[area]/page.tsx:40-42` and `app/(site)/blog/[slug]/page.tsx:51, 181-190` use `areas.slice(0, 8)` or `slice(0, 12)`, which are the first entries of the global list. Every post shows the same 12 links.
- `app/(site)/areas/[area]/[service]/page.tsx:148-150` already does this correctly.

**Fix:** use region- or distance-based neighbours everywhere.

### 19. Unsupported claims on brand pages
- `app/(site)/brands/[brand]/page.tsx:26-27, 55`: "Genuine {brand} spare parts" for every brand.

**Fix:** remove the claim for brands not serviced, or noindex those pages.

### 20. Reviews count and missing review markup
- `app/(site)/reviews/page.tsx`: "9+ verified reviews" undersells the page.
- No Review or AggregateRating schema exists. The "4.5+ rated technicians … rated by thousands" claim in `app/(config)/content.ts` is not supported by the 9 reviews in `site.ts`.

**Fix:** correct the count, add review markup only for genuine reviews, and source or soften the rating claim.

### 21. Brand links hidden until click
- `app/(ui)/components/brands-grid.tsx:12`: `brands.slice(0, 8)` until expanded, so other brand links are not in the server HTML.

**Fix:** render all links and hide the overflow with CSS.

### 22. Heading structure lost in list items
- `app/(ui)/components/how-it-works.tsx`, `why-choose-us.tsx`: item titles are `<p>`, not headings. Footer column titles have the same problem.

**Fix:** use `<h3>` for items and `<h2>` for footer columns.

### 23. Area and brand page thinness
- Several keyword, brand and near-me pages are template-based with little unique copy.
- `app/(site)/near-me/[service]/page.tsx`: six generic pages with "near me" titles and no location signal.

**Fix:** noindex or merge into the service pages.

### 24. Local business schema is weak
- `app/layout.tsx:95-119`: uses `Organization`, with `streetAddress: "Indiranagar"` (a neighbourhood, `site.ts:19`), `sameAs: []`, and no `openingHours` even though `site.hours` exists (`site.ts:15`).
- Service pages: `Service` has no `url`, `description` or `@id`; provider has no `openingHours` or `image`.

**Fix:** use `LocalBusiness` or `HomeAndConstructionBusiness` with `areaServed`, `openingHoursSpecification`, a real street address, and `@id`. Add the missing service fields.

### 25. Breadcrumbs lack structured data
- `app/(ui)/components/service-hero.tsx:~17`: breadcrumb is plain text with no `BreadcrumbList` JSON-LD.

**Fix:** add `BreadcrumbList` schema.

## Low

- **Root language attribute**: `app/layout.tsx:95` is `lang="en"` on an en-IN site. Use `lang="en-IN"`.
- **Not-found canonical**: `app/not-found.tsx:13` points to `/404`, which is itself a 404. Remove it.
- **Canonical inheritance**: `app/layout.tsx:44` root canonical `/` is inherited by any route whose `generateMetadata` omits `alternates`. Example: `app/(site)/near-me/[service]/page.tsx:20` returns no canonical.
- **Legal page descriptions**: `app/(site)/privacy/page.tsx:6` and `terms/page.tsx:6` are about 33 characters. Write 120-160 characters.
- **Image alt text**:
  - `app/(ui)/components/tips-section.tsx`: decorative image has `alt="Maintenance tips"` on all service pages. Use `alt=""`.
  - `app/(ui)/components/faq-section.tsx`: alt repeats the heading. Use `alt=""`.
  - `app/(site)/contact/page.tsx:~40`: alt is copied from the homepage. Describe the actual image.
- **Anchor text**: `app/(site)/page.tsx:~137` has four "Read more" links. Use the service name in each.
- **Keywords meta tag**: `app/layout.tsx:24-43` is ignored by Google. Remove it.
- **Social images**: `app/opengraph-image.tsx` and `app/twitter-image.tsx` use one image for every route. Consider per-service images for the six service pages.
- **Slug stability**: `app/(common-lib)/slugify.ts` produces collision-free slugs, but renaming an area changes its URL with no redirect. Add explicit slug fields and redirects if names change.
- **Blog heading detection**: `app/(site)/blog/[slug]/page.tsx:37-39` treats any paragraph not ending in "." or "?" as an H2. Use an explicit heading marker in the content data.
- **Area count drift**: "84+" areas in `blog-layouts.ts` and `blog.ts` differs from the 85 entries in `site.ts`. Derive counts from `areas.length`.

## Verified clean

- All images use `next/image`; no raw `<img>` tags.
- No `href="#"` or empty anchors.
- No `noindex` on public pages; only `/404` is noindexed, intentionally.
- No `http://` links to the site's own domain, and no localhost or staging hosts.
- No page is `"use client"`, so page content is server-rendered. Client components render without `useEffect` gating.
- `robots.ts` allows `/` and points to `/sitemap.xml`, which exists. Sitemap children reference only existing routes.
- `metadataBase` is set; `html lang` is present.
- `next.config.ts` has no redirects or rewrites.
- Dynamic pages return 404 for unknown slugs (`notFound()`).
- Canonicals on dynamic pages are self-referencing.
- Area and brand titles and descriptions are unique per page; duplication is in body content.
- FAQPage JSON-LD matches visible answers on the homepage and service pages.
- Phone number and email are consistent with `site.ts` across the site.
- Sora font loads via `next/font` with `display: swap`. GTM loads `afterInteractive`.

## Not verified

- Rendered HTML and actual indexing status (no live crawl or Search Console data).
- Whether the areas, brands and keywords are actually serviced.
- Whether reviews and rating claims are genuine.
- Googlebot rendering of reveal animations (`app/(ui)/components/reveal.tsx:20` renders `opacity: 0` until in view; text is in the HTML, but below-fold reveal in Googlebot's render is unconfirmed). Check the URL Inspection screenshot.
- Hosting-level HTTP-to-HTTPS and apex-to-www redirects (no `vercel.json` or redirect config in the repo).
- Real SERP truncation (character counts are estimates).
- Whether a live 404 status is returned in production.

## Suggested order

1. Replace the placeholder phone number; fix the footer and contact phone output.
2. Block `/admin` and `/api` in robots and add noindex on admin pages.
3. Remove the "Urban Company" keyword entries.
4. Noindex or prune the templated area, brand and keyword pages, and update the sitemaps to match.
5. Shorten titles and descriptions; add homepage metadata.
6. Make service-page copy service-specific.
7. Correct sitemap dates and frequencies; fix schema types and fields.
8. Confirm everything in Search Console and with a Rich Results test.
