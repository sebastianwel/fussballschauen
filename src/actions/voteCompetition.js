"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function voteCompetition(barId, competitionId) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    // 1. Bar Daten holen (Votes UND aktuellen Score)
    const { data: bar, error: fetchError } = await supabase
      .from("bars")
      .select("competition_votes, verification_score")
      .eq("id", barId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Votes Logik (wie vorher)
    const currentVotes = bar.competition_votes || {};
    const newCount = (currentVotes[competitionId] || 0) + 1;
    const updatedVotes = { ...currentVotes, [competitionId]: newCount };

    // 3. Score Logik (NEU!)
    // Wir erhöhen den Score um 1
    const currentScore = bar.verification_score || 0;
    const newScore = currentScore + 1;

    // 4. Update beides zusammen
    const { error: updateError } = await supabase
      .from("bars")
      .update({
        competition_votes: updatedVotes,
        verification_score: newScore,
      })
      .eq("id", barId);

    if (updateError) throw updateError;

    revalidatePath(`/bar/${barId}`);
    // Optional: Auch die Map/Startseite aktualisieren
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Voten:", error);
    return { success: false, error: error.message };
  }
}
