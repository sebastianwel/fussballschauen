import { createClient } from "@supabase/supabase-js";
import BarList from "@/components/BarList";
import Link from "next/link";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Hilfsfunktion: Erstellt Suchvarianten für deutsche Umlaute.
 * Beispiel: "muenchen" -> ["muenchen", "münchen"]
 */
function getCityVariants(slug) {
  const base = decodeURIComponent(slug).toLowerCase();
  const variants = [base];
  const mapping = { ae: "ä", oe: "ö", ue: "ü", ss: "ß" };

  let withUmlauts = base;
  Object.entries(mapping).forEach(([key, val]) => {
    withUmlauts = withUmlauts.replace(new RegExp(key, "g"), val);
  });

  if (withUmlauts !== base) variants.push(withUmlauts);
  return variants;
}

// --- SEO METADATA ---
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const variants = getCityVariants(resolvedParams.city);
  // Wir nehmen die Version mit Umlauten für den Titel, falls vorhanden
  const displayCity = variants.length > 1 ? variants[1] : variants[0];
  const capitalizedCity =
    displayCity.charAt(0).toUpperCase() + displayCity.slice(1);

  return {
    title: `Fußball live in ${capitalizedCity} schauen | Die besten Kneipen 🍻`,
    description: `Finde die besten Fußballkneipen in ${capitalizedCity}. Von Bundesliga bis Champions League – alle Sportbars mit Live-Übertragung und Inhaber-Bestätigung.`,
    alternates: {
      canonical: `https://wolaeuftfussball.de/in/${resolvedParams.city}`,
    },
  };
}

export default async function CityLandingPage({ params }) {
  const resolvedParams = await params;
  const variants = getCityVariants(resolvedParams.city);

  // Erstellt einen Supabase OR-Filter: "city.ilike.muenchen,city.ilike.münchen"
  const cityFilter = variants.map((v) => `city.ilike.${v}`).join(",");

  // Bars für die Stadt laden
  const { data: bars, error } = await supabase
    .from("bars")
    .select("*")
    .or(cityFilter)
    .or(
      "google_meta.is.null,google_meta->>status.eq.OPERATIONAL,google_meta->>status.is.null",
    )
    .order("verification_score", { ascending: false })
    .limit(20);

  if (error) console.error("Supabase Error:", error);
  if (!bars || bars.length === 0) return notFound();

  // Wir nutzen den echten Namen aus der DB für die Anzeige (z.B. "München" statt "muenchen")
  const cityName = bars[0].city;
  const verifiedCount = bars.filter((b) => b.is_claimed).length;

  return (
    <main style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* --- HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <div style={styles.badge}>Stadt-Guide {new Date().getFullYear()}</div>
          <h1 style={styles.h1}>
            Fußball live in <br />
            <span style={{ color: "#facc15" }}>{cityName}</span> schauen
          </h1>
          <p style={styles.subtitle}>
            Wir haben {bars.length} Fußballkneipen in {cityName} gefunden.
            {verifiedCount > 0 &&
              ` Davon sind ${verifiedCount} Locations offiziell verifiziert.`}
          </p>

          <div style={{ marginTop: "30px" }}>
            <Link href={`/search?q=${cityName}`} style={styles.primaryBtn}>
              Alle auf der Karte suchen →
            </Link>
          </div>
        </div>
      </section>

      {/* --- TOP LOCATIONS LISTE --- */}
      <section style={{ padding: "60px 20px" }}>
        <div style={styles.container}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>Top Empfehlungen in {cityName}</h2>
            <p style={{ color: "#64748b" }}>
              Basierend auf Community-Bewertungen und Inhaber-Status.
            </p>
          </div>

          <BarList bars={bars} />

          <div style={styles.cardCTA}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                marginBottom: "12px",
              }}
            >
              Die richtige Bar noch nicht gefunden?
            </h3>
            <p
              style={{
                color: "#64748b",
                fontSize: "1.05rem",
                lineHeight: "1.5",
              }}
            >
              Nutze unsere Live-Karte, um gezielt nach{" "}
              <strong>Wettbewerben</strong> wie der Bundesliga, Champions League
              oder deinem Lieblingsverein zu filtern.
            </p>
            <Link href={`/search?q=${cityName}`} style={styles.secondaryBtn}>
              Zur interaktiven Karte von {cityName}
            </Link>
          </div>
        </div>
      </section>

      {/* --- SEO CONTENT SECTION --- */}
      <section style={styles.seoContent}>
        <div style={styles.container}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                color: "#0f172a",
                marginBottom: "20px",
              }}
            >
              Sportbars in {cityName}: Wo läuft heute Fußball?
            </h2>
            <p style={styles.text}>
              {cityName} ist eine Stadt mit echter Fußball-Leidenschaft. Egal ob
              du ein Fan der Bundesliga, der Premier League oder der Champions
              League bist, die Auswahl an Kneipen ist riesig. Auf{" "}
              <strong>wolaeuftfussball.de</strong> helfen wir dir, genau die Bar
              zu finden, die deinen Ansprüchen gerecht wird.
            </p>
            <p style={styles.text}>
              Worauf solltest du achten? In vielen Kneipen in {cityName} wird
              das Spiel mit Original-Kommentar gezeigt. Achte in unserer Liste
              auf das <strong>Inhaber-Siegel</strong> – diese Wirte pflegen ihr
              Programm selbst ein, damit du garantiert nicht vor einer dunklen
              Leinwand stehst.
            </p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <Link href="/" style={styles.footerLink}>
          Startseite
        </Link>
        <span style={{ margin: "0 10px", color: "#cbd5e1" }}>/</span>
        <span
          style={{ color: "#0f172a", fontWeight: "bold", fontSize: "0.9rem" }}
        >
          {cityName}
        </span>
      </footer>
    </main>
  );
}

// --- STYLES ---
const styles = {
  container: { maxWidth: "1100px", margin: "0 auto" },
  hero: {
    background: "#0f172a",
    backgroundImage:
      "radial-gradient(circle at 20% 30%, #1e293b 0%, #0f172a 100%)",
    color: "white",
    padding: "100px 20px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "rgba(59, 130, 246, 0.2)",
    color: "#60a5fa",
    padding: "6px 16px",
    borderRadius: "50px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  h1: {
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: "900",
    lineHeight: "1.1",
    marginBottom: "20px",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#94a3b8",
    maxWidth: "700px",
    margin: "0 auto",
  },
  sectionHeader: { marginBottom: "40px", textAlign: "left" },
  primaryBtn: {
    display: "inline-block",
    background: "#0070f3",
    color: "white",
    padding: "16px 32px",
    borderRadius: "12px",
    fontWeight: "bold",
    textDecoration: "none",
    fontSize: "1.1rem",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
  cardCTA: {
    background: "white",
    border: "1px solid #e2e8f0",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    marginTop: "60px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  secondaryBtn: {
    display: "inline-block",
    marginTop: "20px",
    color: "#0070f3",
    fontWeight: "bold",
    textDecoration: "none",
    fontSize: "1rem",
    border: "2px solid #0070f3",
    padding: "12px 24px",
    borderRadius: "10px",
  },
  seoContent: {
    background: "white",
    padding: "80px 20px",
    borderTop: "1px solid #e2e8f0",
  },
  text: {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#475569",
    marginBottom: "20px",
  },
  footer: {
    padding: "40px 20px",
    textAlign: "center",
    borderTop: "1px solid #e2e8f0",
  },
  footerLink: { color: "#64748b", textDecoration: "none", fontSize: "0.9rem" },
};
