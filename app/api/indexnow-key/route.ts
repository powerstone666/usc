import { indexNowKey } from "@/app/(server-lib)/indexnow";

export const dynamic = "force-dynamic";

// Served at /<key>.txt through a rewrite in next.config.ts. IndexNow checks this file to confirm
// that whoever submits URLs controls the site. 404 for any other name.
export async function GET(req: Request) {
  const key = indexNowKey();
  // req.url keeps the address the visitor asked for (/<key>.txt), not the rewritten one.
  const url = new URL(req.url);
  const asked = url.searchParams.get("key") ?? url.pathname.replace(/^\/|\.txt$/g, "");
  if (!key || asked !== key) return new Response("Not found", { status: 404 });
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
