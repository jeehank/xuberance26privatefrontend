import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

// GET: Retrieve registrations for the current logged-in member
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: registrations, error } = await supabaseAdmin
      .from("registrations")
      .select("id, event_title, participants, created_at")
      .eq("member_id", session.id)
      .order("event_title", { ascending: true });

    if (error) {
      console.error("Error fetching member registrations:", error);
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, registrations });
  } catch (e) {
    console.error("Member GET registrations error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create or replace registration for an event
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventTitle, participants } = await req.json();

    if (!eventTitle || !participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: "Event title and participants list are required" },
        { status: 400 }
      );
    }

    // Rate Limiting: 30 registration operations per minute per member IP
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const limiterKey = `register:${ip}:${session.id}`;
    const limitCheck = await rateLimit(limiterKey, 30, 60000);

    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    // Validate participants
    for (const p of participants) {
      if (!p.name || !p.number || !p.class) {
        return NextResponse.json(
          { error: "All participant fields (Name, Number, Class) must be filled" },
          { status: 400 }
        );
      }
    }

    // 1. Delete previous registration if it exists, to replace it
    const { error: deleteError } = await supabaseAdmin
      .from("registrations")
      .delete()
      .eq("member_id", session.id)
      .eq("event_title", eventTitle);

    if (deleteError) {
      console.error("Error deleting old registration:", deleteError);
      return NextResponse.json(
        { error: "Failed to clear existing registration" },
        { status: 500 }
      );
    }

    // 2. Insert new registration
    const { data: newReg, error: insertError } = await supabaseAdmin
      .from("registrations")
      .insert({
        member_id: session.id,
        event_title: eventTitle,
        participants: participants,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating registration:", insertError);
      return NextResponse.json(
        { error: "Failed to save registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, registration: newReg });
  } catch (e) {
    console.error("Member POST registration error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a registration for an event
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "member") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventTitle = searchParams.get("eventTitle");

    if (!eventTitle) {
      return NextResponse.json(
        { error: "Event title is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("registrations")
      .delete()
      .eq("member_id", session.id)
      .eq("event_title", eventTitle);

    if (error) {
      console.error("Error deleting registration:", error);
      return NextResponse.json(
        { error: "Failed to delete registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Member DELETE registration error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
