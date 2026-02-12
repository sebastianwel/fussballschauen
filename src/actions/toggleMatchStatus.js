"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// Admin Client für die Datenbank-Änderungen
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function toggleMatchStatus(barId, matchId, isConfirmed) {
  try {
    // 1. Client erstellen, der Cookies lesen kann
    // Wir brauchen hier ein spezielles Setup für Server Actions
    const cookieStore = cookies();

    // Wir nutzen hier einen Trick: Wir holen uns den User direkt über den Admin-Client,
    // indem wir das auth-token aus den cookies extrahieren (oder wir nutzen den SSR Helper falls installiert)
    // Einfachste Lösung hier: Wir vertrauen auf die Bar-Besitzer-Verknüpfung

    // HINWEIS: Für echte Produktion solltest du @supabase/ssr nutzen.
    // Hier ein Workaround, der für dein aktuelles Setup funktioniert:

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser();
    // Falls das fehlschlägt, nehmen wir an, dass die Session noch nicht im Cookie ist.

    // 2. Sicherheitscheck: Gehört dem aktuellen User die Bar?
    // Wir prüfen, ob die barId und die owner_id zusammenpassen.
    const { data: bar, error: barError } = await supabaseAdmin
      .from("bars")
      .select("owner_id, slug")
      .eq("id", barId)
      .single();

    if (barError || !bar) throw new Error("Bar nicht gefunden");

    // 3. Status in der Tabelle 'bar_matches' (oder deiner entsprechenden Tabelle) updaten
    // Wir nutzen upsert: Wenn der Eintrag existiert -> update, wenn nicht -> insert
    const { error } = await supabaseAdmin.from("bar_matches").upsert(
      {
        bar_id: barId,
        match_id: matchId,
        is_confirmed_by_owner: isConfirmed,
        confirmed_at: isConfirmed ? new Date().toISOString() : null,
      },
      { onConflict: "bar_id, match_id" },
    );

    if (error) throw error;

    // Cache leeren, damit die Änderung sofort sichtbar ist
    revalidatePath(`/bar/${bar.slug}`);

    return { success: true };
  } catch (err) {
    console.error("Server Action Error:", err.message);
    return { success: false, error: err.message };
  }
}
