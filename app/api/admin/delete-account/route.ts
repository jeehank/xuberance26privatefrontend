import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify session is admin
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    // 2. Prevent admin from deleting themselves
    if (accountId === session.id) {
      return NextResponse.json(
        { error: "Cannot delete the admin account itself" },
        { status: 400 }
      );
    }

    // 3. Delete account (will cascade to registrations)
    const { error } = await supabaseAdmin
      .from("accounts")
      .delete()
      .eq("id", accountId)
      .eq("role", "member"); // Security check: only allow deleting member accounts

    if (error) {
      console.error("Error deleting member account:", error);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Delete Account API Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
