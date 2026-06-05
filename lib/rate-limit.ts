import { supabaseAdmin } from "./supabase";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
}

/**
 * Checks if the given key has exceeded the rate limit.
 * @param key Unique key for rate limiting (e.g. "ip:action" or "username:action")
 * @param maxHits Maximum number of allowed hits within the window
 * @param windowMs Time window in milliseconds
 */
export async function rateLimit(
  key: string,
  maxHits: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const now = new Date();
    
    // 1. Clean up expired rate limits
    await supabaseAdmin
      .from("rate_limits")
      .delete()
      .lt("expiry", now.toISOString());

    // 2. Look up the key
    const { data: record, error } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error("Rate limit query error:", error);
      return { success: true, limit: maxHits, remaining: maxHits }; // Fallback to allowed on DB failure
    }

    if (!record) {
      // 3. Insert new rate limit entry
      const expiry = new Date(Date.now() + windowMs);
      const { error: insertError } = await supabaseAdmin
        .from("rate_limits")
        .insert({
          key,
          hits: 1,
          expiry: expiry.toISOString(),
        });

      if (insertError) {
        console.error("Rate limit insert error:", insertError);
      }
      return { success: true, limit: maxHits, remaining: maxHits - 1 };
    }

    // 4. Update existing entry
    if (record.hits >= maxHits) {
      return { success: false, limit: maxHits, remaining: 0 };
    }

    const { error: updateError } = await supabaseAdmin
      .from("rate_limits")
      .update({ hits: record.hits + 1 })
      .eq("key", key);

    if (updateError) {
      console.error("Rate limit update error:", updateError);
    }

    return { success: true, limit: maxHits, remaining: maxHits - (record.hits + 1) };
  } catch (e) {
    console.error("Rate limiting exception:", e);
    return { success: true, limit: maxHits, remaining: maxHits }; // Fallback to allowed on exception
  }
}
