import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalyticsWrapper from "@/components/GoogleAnalyticsWrapper";

export const metadata = {
  // WICHTIG: Die Basis-URL für alle relativen Pfade (Sitemap, OG-Bilder)
  metadataBase: new URL("https://wolaeuftfussball.de"),

  title: {
    default:
      "wolaeuftfussball.de | Finde die beste Fußballkneipe in deiner Stadt",
    template: "%s | wolaeuftfussball.de", // Erlaubt Unterseiten "Hamburg | wolaeuftfussball.de" zu heißen
  },
  description:
    "Wo läuft heute Fußball? Finde Sportbars, Kneipen und Public Viewing in deiner Nähe. Alle Wettbewerbe, alle Spiele, live!",

  // Verhindert Duplicate Content (Vercel-Subdomain vs. echte Domain)
  alternates: {
    canonical: "/",
  },

  // OpenGraph (für WhatsApp, Facebook & Co.)
  openGraph: {
    title: "wolaeuftfussball.de | Dein Guide für Live-Fußball",
    description: "Finde sofort heraus, welche Kneipe heute dein Spiel zeigt.",
    url: "https://wolaeuftfussball.de",
    siteName: "wolaeuftfussball.de",
    locale: "de_DE",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "wolaeuftfussball.de",
    description: "Alle Fußballkneipen auf einer Karte.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <StyledComponentsRegistry>
          <Header />
          <main style={{ minHeight: "80vh" }}>{children}</main>

          {/* Rechtliches & Analytics */}
          <CookieBanner />
          <GoogleAnalyticsWrapper />

          <Footer />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
