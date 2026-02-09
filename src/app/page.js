import { createClient } from "@supabase/supabase-js";
import BarList from "@/components/BarList";
import MapWrapper from "@/components/MapWrapper";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const revalidate = 0; // Immer frisch laden

export default async function Home() {
  // Wir laden für die Home-Page einfach die Top 10 Bars (ohne Filter)
  const { data: bars, error } = await supabase
    .from("bars")
    .select(
      "id, name, city, zip_code, slug, features, google_meta, lat, lng, home_team",
    )
    .limit(12) // Nicht zu viele
    .order("verification_score", { ascending: false });

  const barsWithGeo = bars?.filter((b) => b.lat && b.lng) || [];

  return (
    <main style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* --- 1. HERO SECTION (Der Hingucker) --- */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1e2f 0%, #16213e 100%)", // Dunkler, moderner Look
          padding: "80px 20px 100px 20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{ fontSize: "3rem", marginBottom: "1rem", fontWeight: "800" }}
        >
          Wo läuft das Spiel?
        </h1>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem", opacity: 0.9 }}>
          Finde die besten Fußballkneipen in deiner Nähe.
        </p>

        {/* Die SearchBar (leitet jetzt auf /search weiter) */}
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <SearchBar />
        </div>
      </div>

      {/* --- 2. PREVIEW KARTE --- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "-60px auto 40px auto", // Zieht die Karte in den Hero-Bereich rein
          padding: "0 20px",
        }}
      >
        <div
          style={{
            height: "400px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            border: "4px solid white",
          }}
        >
          {/* Hier eine "kleine" Karte zur Übersicht */}
          <MapWrapper bars={barsWithGeo} />
        </div>
      </div>

      {/* --- 3. BELIEBTE BARS LISTE --- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", color: "#333", fontWeight: "bold" }}>
            Beliebte Locations
          </h2>
          <Link
            href="/search"
            style={{
              color: "#0070f3",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Alle auf der Karte zeigen →
          </Link>
        </div>

        <BarList bars={bars || []} />
      </div>
    </main>
  );
}
