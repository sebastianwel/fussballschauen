"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function updateHomeTeam(barId, teamName, isNewEntry = false) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    // Daten holen
    const { data: bar, error: fetchError } = await supabase
      .from("bars")
      .select("home_team_votes, verification_score")
      .eq("id", barId)
      .single();

    if (fetchError) throw fetchError;

    let updateData = {};
    const currentScore = bar.verification_score || 0;

    if (isNewEntry) {
      // Neues Team: Startet mit 1 Vote + Score erhöht sich
      updateData = {
        home_team: teamName,
        home_team_votes: 1,
        verification_score: currentScore + 1,
      };
    } else {
      // Bestätigung: Vote +1, Score +1
      updateData = {
        home_team_votes: (bar.home_team_votes || 0) + 1,
        verification_score: currentScore + 1,
      };
    }

    const { error } = await supabase
      .from("bars")
      .update(updateData)
      .eq("id", barId);

    if (error) throw error;

    revalidatePath(`/bar/${barId}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Fehler beim Heimteam Update:", error);
    return { success: false };
  }
}
