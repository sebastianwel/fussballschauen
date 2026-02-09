import { createClient } from "@supabase/supabase-js";
import SearchClient from "@/components/SearchClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const dynamic = "force-dynamic";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  let lat = params?.lat ? parseFloat(params.lat) : null;
  let lng = params?.lng ? parseFloat(params.lng) : null;
  const isUserLocation = params?.u === "true";

  let bars = [];
  let searchCenter = null;

  // SCHRITT 1: Wenn wir keine Koordinaten haben, aber eine Suchanfrage (z.B. "München")
  // versuchen wir, den Ort zu geocodieren.
  if (!lat && !lng && query) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      );
      const geoData = await geoRes.json();

      if (geoData && geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
        // Wir merken uns, dass wir Koordinaten "gefunden" haben
        searchCenter = [lat, lng];
      }
    } catch (e) {
      console.error("Geocoding Fehler:", e);
    }
  }

  // SCHRITT 2: Bars laden und sortieren

  // Fall A: Wir haben jetzt Koordinaten (Entweder vom User oder durch Geocoding von "München")
  if (lat && lng) {
    const { data } = await supabase
      .from("bars")
      .select("*")
      .not("lat", "is", null)
      .not("lng", "is", null);

    if (data) {
      // Nach Distanz sortieren
      bars = data
        .map((bar) => ({
          ...bar,
          distance: getDistance(lat, lng, bar.lat, bar.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 50);
    }
  }
  // Fall B: Immer noch keine Koordinaten (Suche war kein Ort, sondern z.B. "Irish Pub")
  else if (query) {
    const { data } = await supabase
      .from("bars")
      .select("*")
      .or(`name.ilike.%${query}%,city.ilike.%${query}%`)
      .limit(50);
    bars = data || [];
  } else {
    // Default
    const { data } = await supabase
      .from("bars")
      .select("*")
      .order("verification_score", { ascending: false })
      .limit(50);
    bars = data || [];
  }

  return (
    <SearchClient
      bars={bars}
      query={query}
      initialLat={lat}
      initialLng={lng}
      isUserLocation={isUserLocation}
    />
  );
}
