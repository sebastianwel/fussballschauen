"use server";

import { createClient } from "@supabase/supabase-js";

// Initialisierung des Admin-Clients mit dem Service Role Key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * Erstellt ein offizielles Konto für den Bar-Inhaber und verknüpft es permanent.
 */
export async function completeOwnerSetup(barId, email, password) {
  try {
    // 1. Neuen User in Supabase Auth anlegen (Server-seitig)
    const { data: userData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Da wir die E-Mail bereits verifiziert haben
      });

    if (authError) throw authError;
    const userId = userData.user.id;

    // 2. Den neuen User als Owner eintragen UND den Slug für den Redirect abrufen
    const { data: barData, error: barError } = await supabaseAdmin
      .from("bars")
      .update({
        owner_id: userId,
        is_claimed: true,
      })
      .eq("id", barId)
      .select("slug")
      .single();

    if (barError) throw barError;

    // 3. Den Verifizierungsvorgang in 'bar_claims' abschließen
    await supabaseAdmin
      .from("bar_claims")
      .update({ user_id: userId, status: "verified" })
      .eq("bar_id", barId)
      .eq("email_sent_to", email);

    // Wir geben den Erfolg und den Slug für das Frontend zurück
    return { success: true, slug: barData.slug };
  } catch (error) {
    console.error("Setup Error:", error);
    return { success: false, error: error.message };
  }
}
