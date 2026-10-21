import { NextResponse } from "next/server";

const FLASK_URL = "http://160.236.58.192:5000";
const API_KEY = "CHANGE_ME_API_KEY";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // 🐍 Python Flask-এ রেজিস্ট্রেশন রিকোয়েস্ট
    const res = await fetch(`${FLASK_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": API_KEY },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Registration failed" }, { status: res.status });
    }
    
    return NextResponse.json({ ok: true, user: data.user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
