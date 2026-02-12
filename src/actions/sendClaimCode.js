"use server";

import { createClient } from "@supabase/supabase-js";

// Supabase Admin Client (nutzt den Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * Sendet einen Verifizierungscode an die Bar-Email.
 */
export async function sendClaimCode(barId, email, userId = null) {
  try {
    // 1. 6-stelligen Code generieren
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Sicherheit: Alte "pending" Codes für diese Kombination enterten
    await supabaseAdmin
      .from("bar_claims")
      .update({ status: "expired" })
      .eq("bar_id", barId)
      .eq("email_sent_to", email)
      .eq("status", "pending");

    // 3. Neuen Code in die Tabelle 'bar_claims' schreiben
    const { error: dbError } = await supabaseAdmin.from("bar_claims").insert({
      bar_id: barId,
      user_id: userId,
      verification_code: code,
      email_sent_to: email,
      status: "pending",
    });

    if (dbError) throw new Error("Code konnte nicht gespeichert werden.");

    // 4. E-Mail über Resend versenden
    // WICHTIG: Solange deine Domain nicht verifiziert ist, gelten die Sandbox-Regeln!
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        /* TEST-MODUS HINWEIS: 
           - 'from' muss 'onboarding@resend.dev' sein, solange Domain nicht verifiziert.
           - 'to' kann im Sandbox-Modus NUR an deine eigene Resend-Login-Mail senden.
        */
        from: "KneipenCheck <onboarding@resend.dev>",
        to: [email], // Zum Testen hier deine eigene E-Mail eintragen, falls die Bar-Mail anders ist
        subject: "Dein Bestätigungscode zur Bar-Verifizierung",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; background-color: white;">
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="font-size: 40px;">🛡️</span>
            </div>
            <h2 style="color: #0f172a; text-align: center; margin-bottom: 10px;">Inhaber-Verifizierung</h2>
            <p style="color: #64748b; font-size: 16px; text-align: center; line-height: 1.5;">
              Du hast eine Verifizierung für deinen Eintrag auf <strong>wolaeuftfussball.de</strong> angefordert.<br>
              Gib diesen Code auf der Website ein:
            </p>
            <div style="background: #f8fafc; padding: 24px; border-radius: 12px; text-align: center; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #0070f3; border: 1px solid #e2e8f0; margin: 25px 0;">
              ${code}
            </div>
            <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 20px;">
              Der Code ist 24 Stunden gültig. Falls du dies nicht angefordert hast, kannst du diese E-Mail einfach löschen.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API Error:", errorData);
      throw new Error("E-Mail Provider Fehler (Sandbox-Limit?).");
    }

    return { success: true };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
