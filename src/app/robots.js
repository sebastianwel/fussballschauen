// src/app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/login", "/admin", "/api/"], // Private Bereiche sperren
      },
    ],
    sitemap: "https://wolaeuftfussball.de/sitemap.xml",
  };
}
