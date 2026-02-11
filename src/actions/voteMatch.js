"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function voteMatch(barId, matchId, type, oldType = null) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  try {
    const { data: existingEntry, error: fetchError } = await supabase
      .from("bar_matches")
      .select("id, upvotes, downvotes")
      .eq("bar_id", barId)
      .eq("match_id", matchId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingEntry) {
      let newUpvotes = existingEntry.upvotes;
      let newDownvotes = existingEntry.downvotes;

      // 1. ALTEN Vote abziehen (falls der User seine Meinung ändert)
      if (oldType === "up") newUpvotes = Math.max(0, newUpvotes - 1);
      if (oldType === "down") newDownvotes = Math.max(0, newDownvotes - 1);

      // 2. NEUEN Vote hinzufügen (außer wenn er auf "Rückgängig" geklickt hat)
      if (type === "up") newUpvotes += 1;
      if (type === "down") newDownvotes += 1;

      await supabase
        .from("bar_matches")
        .update({ upvotes: newUpvotes, downvotes: newDownvotes })
        .eq("id", existingEntry.id);
    } else if (type !== "reset") {
      // Neuer Eintrag in der DB
      await supabase.from("bar_matches").insert([
        {
          bar_id: barId,
          match_id: matchId,
          upvotes: type === "up" ? 1 : 0,
          downvotes: type === "down" ? 1 : 0,
        },
      ]);
    }

    revalidatePath(`/bar/${barId}`); // Löst den Reload der Seite aus
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Match Vote:", error);
    return { success: false, error: error.message };
  }
}
