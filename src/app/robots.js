export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Wir sperren private Bereiche und technische Endpunkte
        disallow: [
          "/login",
          "/admin",
          "/api/",
          "/owner-dashboard", // Falls das eine eigene Route ist
          "/setup-success", // Beispiel für eine Dankesseite nach Registrierung
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        // Verhindert, dass Google unendliche Filter-Kombinationen in der Suche crawlt
        // Aber erlaubt die normale Suche und die Städte-Seiten
        disallow: ["/search?*filter=", "/search?*sort="],
      },
    ],
    sitemap: "https://wolaeuftfussball.de/sitemap.xml",
  };
}
