import { createClient } from "@supabase/supabase-js";

// Hilfsfunktion: Muss exakt die gleiche Logik wie in deiner PopularCities/Landingpage sein
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export default async function sitemap() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  // 1. Daten abrufen
  const { data: bars } = await supabase
    .from("bars")
    .select("slug, city, updated_at");

  if (!bars) return [];

  // --- BAR ENTRIES ---
  const barEntries = bars.map((bar) => ({
    url: `https://wolaeuftfussball.de/bar/${bar.slug}`,
    lastModified: bar.updated_at || new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // --- CITY ENTRIES ---
  // Wir nutzen Set für Einzigartigkeit und slugify für saubere URLs
  const uniqueCities = [...new Set(bars.map((bar) => bar.city))].filter(
    Boolean,
  );

  const cityEntries = uniqueCities.map((city) => ({
    url: `https://wolaeuftfussball.de/in/${slugify(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
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
      url: "https://wolaeuftfussball.de/owner-setup",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://wolaeuftfussball.de/impressum", // NEU
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://wolaeuftfussball.de/datenschutz", // NEU
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...cityEntries, ...barEntries];
}
