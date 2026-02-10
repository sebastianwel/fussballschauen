"use server";

import { createClient } from "@supabase/supabase-js";
import { COMPETITIONS } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function addBar(formData) {
  const name = formData.get("name");
  const street = formData.get("street");
  const zip = formData.get("zip");
  const city = formData.get("city");
  const home_team = formData.get("home_team") || null;

  // --- NEUE FELDER ---
  const opening_hours = formData.get("opening_hours");
  const website = formData.get("website");
  const phone_number = formData.get("phone");

  // --- 1. GEOCODING (OpenStreetMap) ---
  const addressQuery = `${street}, ${zip} ${city}`;
  let lat = null;
  let lng = null;

  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1`,
      { headers: { "User-Agent": "Fussballschauen-App" } },
    );
    const geoData = await geoRes.json();
    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lng = parseFloat(geoData[0].lon);
    }
  } catch (e) {
    console.error("Geocoding Fehler:", e);
  }

  // --- 2. LOGIK: WETTBEWERBE ---
  const selectedCompetitions = COMPETITIONS.filter(
    (comp) => formData.get(comp.id) === "on",
  ).map((comp) => comp.id);

  const impliesSky = selectedCompetitions.some((id) =>
    ["bundesliga", "bundesliga2", "dfb_pokal"].includes(id),
  );
  const impliesDazn = selectedCompetitions.some((id) =>
    ["champions_league", "europa_league", "bundesliga"].includes(id),
  );
  const impliesFreeTv = selectedCompetitions.some(
    (id) =>
      ["em_wm", "dfb_pokal"].includes(id) ||
      formData.get("free_tv_general") === "on",
  );

  // --- 3. SLUG ---
  const slug = `${name}-${city}`
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // --- 4. SPEICHERN ---
  const { data, error } = await supabase
    .from("bars")
    .insert([
      {
        name,
        city,
        zip_code: zip,
        address: street,
        slug,
        lat,
        lng,
        home_team,
        opening_hours,
        contact_info: { phone: phone_number, website: website },

        shown_competitions: selectedCompetitions,
        features: {
          sky: impliesSky,
          dazn: impliesDazn,
          free_tv: impliesFreeTv,
        },
        status: "active",
        verification_score: 1,
      },
    ])
    .select();

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, slug: data[0].slug };
}
