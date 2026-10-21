import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "email + password (6+ chars) required" }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await createUser(email, hash);
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
