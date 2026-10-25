// IndexNow: tells Bing, Yandex and other participating search engines about new, changed or
// removed URLs right away instead of waiting for them to re-crawl. Google does not use it.
// Off unless INDEXNOW_KEY is set. The key is public by design: it must be served at /<key>.txt
// (see the rewrite in next.config.ts and app/api/indexnow-key/route.ts).
import { site } from "@/app/(config)/site";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 10000; // protocol limit per request

export const indexNowKey = (): string | null => {
  const key = process.env.INDEXNOW_KEY?.trim();
  return key && /^[A-Za-z0-9-]{8,128}$/.test(key) ? key : null;
};

export type IndexNowResult = { ok: boolean; submitted: number; skipped?: string; error?: string };

/** Only URLs on our own host may be submitted. */
export function ownUrls(urls: string[]): string[] {
  const host = new URL(site.url).host;
  return [...new Set(urls)].filter((u) => {
    try {
      return new URL(u).host === host;
    } catch {
      return false;
    }
  });
}

export async function submitUrls(urls: string[]): Promise<IndexNowResult> {
  const key = indexNowKey();
  if (!key) return { ok: true, submitted: 0, skipped: "INDEXNOW_KEY is not set." };
  if (process.env.ADMIN_DEMO === "1") return { ok: true, submitted: 0, skipped: "Demo mode does not contact search engines." };
  const list = ownUrls(urls);
  if (list.length === 0) return { ok: true, submitted: 0 };
  try {
    for (let i = 0; i < list.length; i += BATCH) {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(site.url).host, key, keyLocation: `${site.url}/${key}.txt`, urlList: list.slice(i, i + BATCH) }),
        signal: AbortSignal.timeout(10000),
      });
      // 200 and 202 both mean accepted. 403/422 mean the key file could not be verified or the URLs do not match the host.
      if (res.status !== 200 && res.status !== 202) return { ok: false, submitted: i, error: `IndexNow answered ${res.status}${res.status === 403 ? " (the key file at " + site.url + "/" + key + ".txt could not be verified)" : ""}.` };
    }
    return { ok: true, submitted: list.length };
  } catch (e) {
    return { ok: false, submitted: 0, error: `Could not reach IndexNow: ${(e as Error).message}` };
  }
}

/** Every URL listed in our own sitemaps, read from the live site. */
export async function collectSitemapUrls(): Promise<string[] | { error: string }> {
  const get = async (u: string) => {
    const res = await fetch(u, { signal: AbortSignal.timeout(10000), cache: "no-store" });
    if (!res.ok) throw new Error(`${u} answered ${res.status}`);
    return res.text();
  };
  const locs = (xml: string) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  try {
    const children = locs(await get(`${site.url}/sitemap.xml`));
    const pages = await Promise.all(children.map(async (c) => locs(await get(c))));
    return pages.flat();
  } catch (e) {
    return { error: `Could not read the sitemaps: ${(e as Error).message}` };
  }
}
