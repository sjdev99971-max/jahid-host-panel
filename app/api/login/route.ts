import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const res = await fetch("http://160.236.58.192:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": "1e22d35fcacf16246a549d7b3489ae7836d0816315ab93aa" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "ভুল ইমেইল বা পাসওয়ার্ড!" }, { status: 401 });
    }

    const data = await res.json();
    
    // সেশন কুকি সেট করা
    const response = NextResponse.json({ ok: true, user: data.user });
    response.cookies.set("jahid_token", data.token || data.user.id, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // ৭ দিন
      path: "/",
    });
    response.cookies.set("jahid_user", JSON.stringify(data.user), {
      httpOnly: false,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: "সার্ভার কানেক্ট হচ্ছে না!" }, { status: 502 });
  }
}
