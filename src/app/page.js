import { createClient } from "@supabase/supabase-js";
import BarList from "@/components/BarList";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import HomeMapSection from "@/components/HomeMapSection";
import { CommunitySteps } from "@/components/CommunitySteps";
import { HomeQuickFilters } from "@/components/HomeQuickFilters";
import { CommunityStats } from "@/components/CommunityStats";
import { CommunityMission } from "@/components/CommunityMission";
import { LeagueGrid } from "@/components/LeagueGrid";
import { PopularCities } from "@/components/PopularCities";
import { HomeFAQ } from "@/components/HomeFAQ";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const metadata = {
  title: {
    default: "Wo läuft Fußball? | Finde Fußballkneipen in deiner Nähe",
    template: "%s | wolaeuftfussball.de",
  },
  description:
    "Finde die besten Sportbars und Fußballkneipen in deiner Stadt. Live-Übertragungen, Fan-Infos und Bestätigungen von Wirten.",
  keywords: [
    "Fußballkneipe",
    "Sportbar",
    "Fußball gucken",
    "Live Fußball",
    "Bundesliga Kneipe",
  ],
  metadataBase: new URL("https://wolaeuftfussball.de"),
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://wolaeuftfussball.de",
    siteName: "Wo läuft Fußball?",
  },
};

export const revalidate = 0;

export default async function Home() {
  // --- DIE ROBUSTE ABFRAGE ---
  const { data: bars, error } = await supabase
    .from("bars")
    .select(
      "id, name, city, zip_code, slug, features, google_meta, lat, lng, home_team, verification_score, is_claimed",
    )
    // Logik: Zeige Bar wenn...
    // 1. google_meta ist NULL
    // 2. ODER status ist 'OPERATIONAL'
    // 3. ODER status existiert gar nicht (Filter auf .is.null fängt {} ab)
    .or(
      "google_meta.is.null,google_meta->>status.eq.OPERATIONAL,google_meta->>status.is.null",
    )
    .order("verification_score", { ascending: false });

  if (error) {
    console.error("Supabase Error:", error);
  }

  // --- RANKING BOOST ---
  // Wir sortieren im Server-Code, damit Claims IMMER oben stehen
  const sortedBars = bars
    ? [...bars].sort((a, b) => {
        if (a.is_claimed && !b.is_claimed) return -1;
        if (!a.is_claimed && b.is_claimed) return 1;
        return (b.verification_score || 0) - (a.verification_score || 0);
      })
    : [];

  const barsWithGeo = sortedBars.filter((b) => b.lat && b.lng);
  const popularBars = sortedBars.slice(0, 50);

  return (
    <main style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* --- HERO SECTION --- */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1e2f 0%, #16213e 100%)",
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

        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <SearchBar />
          <HomeQuickFilters />
        </div>
      </div>

      {/* --- PREVIEW KARTE --- */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "-60px auto 40px auto",
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
            background: "white",
          }}
        >
          <HomeMapSection barsWithGeo={barsWithGeo} />
        </div>
      </div>

      <CommunitySteps />
      <CommunityMission />
      <CommunityStats barsCount={barsWithGeo.length} />
      <PopularCities />
      <LeagueGrid />

      {/* --- BELIEBTE BARS LISTE --- */}
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

        <BarList bars={popularBars} />
        <HomeFAQ />
      </div>
    </main>
  );
}
