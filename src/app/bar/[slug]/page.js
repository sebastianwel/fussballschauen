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
  const { slug } = params;

  // Hier die Bar aus Supabase holen
  const { data: bar } = await supabase
    .from("bars")
    .select("name, city, home_team")
    .eq("slug", slug)
    .single();

  if (!bar) return { title: "Bar nicht gefunden" };

  const title = `${bar.name} in ${bar.city} | Fußball live schauen`;
  const description = `Fußball live im ${bar.name} in ${bar.city}. ${
    bar.home_team ? `Offizielle Kneipe von ${bar.home_team}.` : ""
  } Alle Spiele, Wettbewerbe und Infos auf wolaeuftfussball.de.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(bar.name)}`], // Optional: Dynamische Bilder
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

  let upcomingMatches = [];

  const verifiedLeagues = Object.entries(bar.competition_votes || {})
    .filter(([_, votes]) => votes > 0)
    .map(([leagueId]) => LEAGUE_MAPPING[leagueId] || leagueId);

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
      .gte("start_time", new Date().toISOString())
      .or(orConditions.join(","))
      .order("start_time", { ascending: true });

    upcomingMatches = matches || [];
  }

  // --- HIER WAR DER FEHLER: Wir laden jetzt is_confirmed_by_owner mit ---
  if (upcomingMatches.length > 0) {
    const matchIds = upcomingMatches.map((m) => m.id);

    const { data: votesData } = await supabase
      .from("bar_matches")
      .select("match_id, upvotes, downvotes, is_confirmed_by_owner") // <--- Hinzugefügt!
      .eq("bar_id", bar.id)
      .in("match_id", matchIds);

    if (votesData && votesData.length > 0) {
      upcomingMatches = upcomingMatches.map((match) => {
        const vote = votesData.find((v) => v.match_id === match.id);
        return {
          ...match,
          bar_upvotes: vote ? vote.upvotes : 0,
          bar_downvotes: vote ? vote.downvotes : 0,
          is_confirmed_by_owner: vote ? vote.is_confirmed_by_owner : false, // <--- Hinzugefügt!
        };
      });
    }
  }

  const barWithMatches = { ...bar, upcomingMatches };

  return (
    <>
      <DetailView bar={barWithMatches} returnParams={returnTo} />
      <BarDisclaimer />
    </>
  );
}
