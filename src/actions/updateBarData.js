"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function updateBarData(barId, data) {
  try {
    const { data: bar, error } = await supabaseAdmin
      .from("bars")
      .update(data)
      .eq("id", barId)
      .select("slug")
      .single();

    if (error) throw error;
    revalidatePath(`/bar/${bar.slug}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
