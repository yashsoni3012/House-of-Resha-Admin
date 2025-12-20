export async function proxy(req) {
  const targetBase = "https://api.houseofresha.com";
  const url = new URL(req.url);

  // expected path: /api/proxy/<anything>
  const upstreamPath = url.pathname.replace(/^\/api\/proxy/, "");
  const upstreamUrl = `${targetBase}${upstreamPath}${url.search}`;

  // Copy headers but remove host-related ones
  const headers = new Headers(req.headers);
  headers.delete("host");

  // IMPORTANT: do not forward origin; Vercel should be the origin to upstream
  headers.delete("origin");
  headers.delete("referer");

  const init = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
    redirect: "manual",
  };

  const res = await fetch(upstreamUrl, init);

  // Build response
  const resHeaders = new Headers(res.headers);

  // Allow browser to call Vercel proxy from your site
  resHeaders.set("Access-Control-Allow-Origin", "*");
  resHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  resHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return new Response(res.body, {
    status: res.status,
    headers: resHeaders,
  });
}