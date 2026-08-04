import { NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "";

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 },
    );
  }

  const token = createHash("sha256")
    .update(`${adminUser}:${adminPass}`)
    .digest("hex");

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
