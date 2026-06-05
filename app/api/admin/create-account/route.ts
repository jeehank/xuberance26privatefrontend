import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify session is admin
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const trimmedUsername = username.trim();
    if (trimmedUsername === "") {
      return NextResponse.json(
        { error: "Username cannot be empty" },
        { status: 400 }
      );
    }

    // 2. Hash password using bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // 3. Save member account to DB
    const { data, error } = await supabaseAdmin
      .from("accounts")
      .insert({
        username: trimmedUsername,
        password_hash: passwordHash,
        role: "member",
      })
      .select("id, username, role")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Account with this username already exists" },
          { status: 409 }
        );
      }
      console.error("Error creating member account:", error);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, account: data });
  } catch (e) {
    console.error("Create Account API Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
