import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://160.236.58.192:5000/health", {
      headers: { "X-API-KEY": "1e22d35fcacf16246a549d7b3489ae7836d0816315ab93aa" },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json({ status: "success", data });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
