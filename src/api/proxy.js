export default async function handler(req, res) {
    // Preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return res.status(204).end();
    }

    const targetBase = "https://api.houseofresha.com";

    // req.url example: /api/proxy/clothing/123?x=1
    const upstreamPath = req.url.replace(/^\/api\/proxy/, "");
    const upstreamUrl = `${targetBase}${upstreamPath}`;

    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin;
    delete headers.referer;

    const upstreamRes = await fetch(upstreamUrl, {
        method: req.method,
        headers,
        body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
        redirect: "manual",
    });

    // Copy upstream headers
    upstreamRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === "content-encoding") return;
        res.setHeader(key, value);
    });

    // Allow browser to call THIS proxy
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    res.status(upstreamRes.status);
    const buf = Buffer.from(await upstreamRes.arrayBuffer());
    res.send(buf);
}