import { createClient } from "@supabase/supabase-js";

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  // 1. Daten abrufen: Wir brauchen Slugs für Bars und Städtenamen
  const { data: bars } = await supabase
    .from("bars")
    .select("slug, city, updated_at");

  if (!bars) return [];

  // --- BARS ENTRIES ---
  const barEntries = bars.map((bar) => ({
    url: `https://wolaeuftfussball.de/bar/${bar.slug}`,
    lastModified: bar.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // --- CITY ENTRIES (SEO Landingpages) ---
  // Wir extrahieren alle einzigartigen Städte aus der Datenbank
  const uniqueCities = [
    ...new Set(bars.map((bar) => bar.city?.toLowerCase())),
  ].filter(Boolean);

  const cityEntries = uniqueCities.map((city) => ({
    url: `https://wolaeuftfussball.de/in/${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily", // Städte-Seiten ändern sich oft, wenn neue Bars dazu kommen
    priority: 0.9, // Städte-Seiten sind extrem wichtig für SEO
  }));

  // --- STATIC ENTRIES ---
  const staticEntries = [
    {
      url: "https://wolaeuftfussball.de",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://wolaeuftfussball.de/search",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://wolaeuftfussball.de/owner-setup", // Landingpage für Wirte
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  return [...staticEntries, ...cityEntries, ...barEntries];
}
