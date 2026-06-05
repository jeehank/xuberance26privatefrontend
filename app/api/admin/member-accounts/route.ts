import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: memberAccounts, error } = await supabaseAdmin
      .from("accounts")
      .select("id, username, created_at")
      .eq("role", "member")
      .order("username", { ascending: true });

    if (error) {
      console.error("Error fetching member accounts:", error);
      return NextResponse.json(
        { error: "Failed to fetch accounts" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, accounts: memberAccounts });
  } catch (e) {
    console.error("Member Accounts API Error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
