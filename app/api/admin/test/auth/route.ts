import { NextResponse } from "next/server";

export async function GET() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.json({
      ok: false,
      detail: "ADMIN_USERNAME or ADMIN_PASSWORD not set in env",
    });
  }

  return NextResponse.json({
    ok: true,
    detail: `Admin credentials configured (username: ${username})`,
  });
}
