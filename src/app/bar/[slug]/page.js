import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import DetailView from "@/components/DetailView";
import { BarDisclaimer } from "@/components/BarDisclaimer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// --- NEU: MAPPING FÜR DIE DATENBANK ---
const LEAGUE_MAPPING = {
  bundesliga: "BL1",
  bundesliga2: "BL2",
  liga3: "BL3",
  dfb_pokal: "DFB",
  champions_league: "UCL",
  europa_league: "UEL",
  conference_league: "CONFL",
};

export const revalidate = 0; // Wichtig: Sorgt dafür, dass Votes sofort sichtbar sind

// --- DYNAMISCHE METADATEN ---
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: bar } = await supabase
    .from("bars")
    .select("name, city, home_team")
    .eq("slug", slug)
    .single();

  if (!bar) {
    return { title: "Bar nicht gefunden" };
  }

  const title = `${bar.name} in ${bar.city} | Fußballschauen.de`;
  const description = `Live Fußball schauen im ${bar.name}${
    bar.home_team ? ` (Heimteam: ${bar.home_team})` : ""
  }. Adresse, Wettbewerbe und Infos auf Fussballschauen.de.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://fussballschauen.de/bar/${slug}`, // Ersetze dies später durch deine echte Domain
      siteName: "Fussballschauen.de",
      locale: "de_DE",
      type: "website",
      images: [
        {
          url: "https://fussballschauen.de/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Fußball gucken im ${bar.name}`,
        },
      ],
    },
  };
}

// --- DIE EIGENTLICHE SEITE ---
export default async function BarPage({ params, searchParams }) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const returnTo = resolvedSearchParams.return_to;

  const { data: bar, error } = await supabase
    .from("bars")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !bar) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>Bar nicht gefunden 😢</h1>
        <Link href="/">Zurück zur Startseite</Link>
      </div>
    );
  }

  // --- NEU: DIE SMARTE SPIEL-ABFRAGE STARTET HIER ---
  let upcomingMatches = [];

  // 1. Welche Ligen hat die Bar (Votes > 0)?
  const verifiedLeagues = Object.entries(bar.competition_votes || {})
    .filter(([_, votes]) => votes > 0)
    .map(([leagueId]) => LEAGUE_MAPPING[leagueId] || leagueId);

  // 2. Spiele aus der Datenbank ziehen (nur wenn Team oder Liga vorhanden)
  if (bar.home_team || verifiedLeagues.length > 0) {
    const orConditions = [];

    if (bar.home_team) {
      orConditions.push(`home_team.eq."${bar.home_team}"`);
      orConditions.push(`away_team.eq."${bar.home_team}"`);
    }

    if (verifiedLeagues.length > 0) {
      const leagueString = verifiedLeagues.map((l) => `"${l}"`).join(",");
      orConditions.push(`league.in.(${leagueString})`);
    }

    const { data: matches } = await supabase
      .from("matches")
      .select("*")
      .gte("start_time", new Date().toISOString()) // Nur Spiele ab "jetzt"
      .or(orConditions.join(","))
      .order("start_time", { ascending: true })
      .limit(8);

    upcomingMatches = matches || [];
  }

  // 3. Community Votes aus "bar_matches" dazuladen
  if (upcomingMatches.length > 0) {
    const matchIds = upcomingMatches.map((m) => m.id);

    const { data: votesData } = await supabase
      .from("bar_matches")
      .select("match_id, upvotes, downvotes")
      .eq("bar_id", bar.id)
      .in("match_id", matchIds);

    if (votesData && votesData.length > 0) {
      upcomingMatches = upcomingMatches.map((match) => {
        const vote = votesData.find((v) => v.match_id === match.id);
        return {
          ...match,
          bar_upvotes: vote ? vote.upvotes : 0,
          bar_downvotes: vote ? vote.downvotes : 0,
        };
      });
    }
  }

  // Bar-Objekt um die gefilterten Matches erweitern
  const barWithMatches = {
    ...bar,
    upcomingMatches,
  };
  // --- ENDE DER SMARTEN ABFRAGE ---

  return (
    <>
      <DetailView bar={barWithMatches} returnParams={returnTo} />
      <BarDisclaimer />
    </>
  );
}
