import { NextResponse } from "next/server";

// POST /api/auth — verify dashboard password server-side
export async function POST(request: Request) {
  const { password } = await request.json();

  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: "गलत password" },
    { status: 401 }
  );
}
