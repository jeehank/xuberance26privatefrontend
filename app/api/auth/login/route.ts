import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Rate Limiting: 5 attempts per minute per IP + username combo
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const limiterKey = `login:${ip}:${username}`;
    const limitCheck = await rateLimit(limiterKey, 5, 60000); // 5 hits per 60 seconds

    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    // Query database for the account
    const { data: account, error } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error("Database query error during login:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    if (!account) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password hash
    const isPasswordValid = bcrypt.compareSync(password, account.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Establish session
    await setSession({
      id: account.id,
      username: account.username,
      role: account.role,
    });

    return NextResponse.json({
      success: true,
      username: account.username,
      role: account.role,
    });
  } catch (e) {
    console.error("Login API Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
