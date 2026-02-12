"use server";

import { createClient } from "@supabase/supabase-js";

// WICHTIG: Nutzt den Service Role Key für Admin-Rechte
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function verifyClaimCode(barId, code, email) {
  try {
    // 1. Suche den Code in der DB (Admin-Rechte umgehen RLS)
    const { data: claim, error } = await supabaseAdmin
      .from("bar_claims")
      .select("id")
      .eq("bar_id", barId)
      .eq("verification_code", code)
      .eq("email_sent_to", email)
      .eq("status", "pending")
      .single();

    if (error || !claim) {
      return { success: false, error: "Code ungültig oder abgelaufen." };
    }

    // 2. Bar als geclaimt markieren
    const { error: updateError } = await supabaseAdmin
      .from("bars")
      .update({ is_claimed: true })
      .eq("id", barId);

    if (updateError) throw updateError;

    // 3. Claim als verifiziert markieren (entwerten)
    await supabaseAdmin
      .from("bar_claims")
      .update({ status: "verified" })
      .eq("id", claim.id);

    return { success: true };
  } catch (err) {
    console.error("Verification Error:", err);
    return { success: false, error: "Serverfehler bei der Verifizierung." };
  }
}
