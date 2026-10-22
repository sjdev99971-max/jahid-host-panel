import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const FLASK = "http://160.236.58.192:5000";
const KEY = "1e22d35fcacf16246a549d7b3489ae7836d0816315ab93aa";

type Ctx = { params: Promise<{ path: string[] }> };

async function handler(req: NextRequest, ctx: Ctx) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { path } = await ctx.params;    // ✅ await params
  const url = `${FLASK}/${path.join("/")}${req.nextUrl.search}`;
  const body = req.method !== "GET" && req.method !== "HEAD"
    ? await req.text()
    : undefined;

  try {
    const res = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": KEY,
        "X-USER-ID": (session.user as any).id ?? "",
        "X-USER-EMAIL": session.user.email ?? "",
      },
      body,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "backend unreachable", detail: e.message },
      { status: 502 }
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
