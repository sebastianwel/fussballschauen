import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import DetailView from "@/components/DetailView";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

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
      // Hier könntest du später ein Bild der Bar oder ein Standard-Vorschaubild verlinken
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

  return <DetailView bar={bar} returnParams={returnTo} />;
}
