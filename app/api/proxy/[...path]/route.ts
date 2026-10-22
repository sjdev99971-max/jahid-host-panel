import { NextRequest, NextResponse } from "next/server";

const FLASK = "http://160.236.58.192:5000";
const KEY = "1e22d35fcacf16246a549d7b3489ae7836d0816315ab93aa";

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const userCookie = req.cookies.get("jahid_user")?.value;
  if (!userCookie) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const user = JSON.parse(userCookie);
  const { path } = await ctx.params;
  const url = `${FLASK}/${path.join("/")}${req.nextUrl.search}`;
  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": KEY,
        "X-USER-ID": user.id.toString(),
        "X-USER-EMAIL": user.email,
      },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: "backend unreachable" }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
