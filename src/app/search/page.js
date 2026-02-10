import { createClient } from "@supabase/supabase-js";
import SearchClient from "@/components/SearchClient";
import { Suspense } from "react";

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

  // --- SCHRITT 1: Geocoding (Nur wenn keine Koordinaten da sind) ---
  if (!lat && !lng && query) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      );
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      }
    } catch (e) {
      console.error("Geocoding Fehler:", e);
    }
  }

  // --- SCHRITT 2: Supabase Abfrage aufbauen ---
  let supabaseQuery = supabase.from("bars").select("*");

  // Grundfilter: Nur Bars, die operativ sind
  supabaseQuery = supabaseQuery.or(
    "google_meta.is.null,google_meta->>status.eq.OPERATIONAL",
  );

  // TEXT-FILTER LOGIK:
  // Wir filtern NUR nach Text, wenn es KEINE automatische User-Ortung ist.
  // Denn bei 'u=true' ist der Query-Text nur die Adresse für die Anzeige.
  if (query && !isUserLocation) {
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,city.ilike.%${query}%,zip_code.ilike.%${query}%`,
    );
  }

  const { data, error } = await supabaseQuery;

  if (data) {
    bars = data;

    // --- SCHRITT 3: Sortierung & Distanz ---
    if (lat && lng) {
      bars = bars
        .map((bar) => ({
          ...bar,
          distance:
            bar.lat && bar.lng ? getDistance(lat, lng, bar.lat, bar.lng) : 9999,
        }))
        .sort((a, b) => a.distance - b.distance);
    } else {
      // Ohne Standort sortieren wir nach dem Verifizierungs-Score
      bars = bars.sort(
        (a, b) => (b.verification_score || 0) - (a.verification_score || 0),
      );
    }

    // Performance-Sicherung
    bars = bars.slice(0, 100);
  }

  return (
    <Suspense fallback={<div>Suche läuft...</div>}>
      <SearchClient
        bars={bars}
        query={query}
        initialLat={lat}
        initialLng={lng}
        isUserLocation={isUserLocation}
      />
    </Suspense>
  );
}
