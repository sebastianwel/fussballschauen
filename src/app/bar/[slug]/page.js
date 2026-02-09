import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import DetailView from "@/components/DetailView"; // Stelle sicher, dass der Pfad stimmt

// Supabase initialisieren
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default async function BarPage({ params }) {
  // --- ÄNDERUNG: params ist jetzt ein Promise in Next.js 15 ---
  const { slug } = await params;
  // ------------------------------------------------------------

  // Die Bar anhand des "slug" laden
  const { data: bar, error } = await supabase
    .from("bars")
    .select("*")
    .eq("slug", slug) // Hier nutzen wir jetzt die ausgepackte Variable
    .single();

  if (error || !bar) {
    console.error("Fehler beim Laden:", error);
    return (
      <div
        style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}
      >
        <h1>Bar nicht gefunden 😢</h1>
        <p>Vielleicht ist die URL falsch oder die Bar wurde gelöscht.</p>
        <br />
        <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
          ← Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  // Daten an die Client-View übergeben
  return <DetailView bar={bar} />;
}
