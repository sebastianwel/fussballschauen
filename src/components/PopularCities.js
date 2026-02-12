"use client";

import styled from "styled-components";
import Link from "next/link";

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  max-width: 1000px;
  margin: 40px auto;
`;

const CityLink = styled(Link)`
  padding: 15px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #0070f3;
    color: #0070f3;
    background: #f0f7ff;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
  }
`;

/**
 * Hilfsfunktion, um Städtenamen für die URL vorzubereiten.
 * Ersetzt Umlaute und Sonderzeichen für saubere SEO-URLs.
 */
const slugifyCity = (city) => {
  return city
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-") // Leerzeichen durch Bindestrich ersetzen (falls nötig)
    .trim();
};

export function PopularCities() {
  const cities = [
    "Hamburg",
    "Berlin",
    "München",
    "Köln",
    "Dortmund",
    "Stuttgart",
    "Leipzig",
    "Bremen",
  ];

  return (
    <section style={{ padding: "60px 20px", background: "#f8fafc" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "1.6rem",
            fontWeight: "900",
            color: "#0f172a",
            letterSpacing: "-0.5px",
          }}
        >
          Fußballstädte entdecken
        </h3>

        <CityGrid>
          {cities.map((city) => (
            <CityLink key={city} href={`/in/${slugifyCity(city)}`}>
              {city}
            </CityLink>
          ))}
        </CityGrid>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "#64748b",
            fontSize: "0.95rem",
          }}
        >
          Deine Stadt nicht dabei?{" "}
          <Link
            href="/search"
            style={{
              color: "#0070f3",
              fontWeight: "700",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            Alle Städte auf der Karte suchen
          </Link>
        </p>
      </div>
    </section>
  );
}
