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
  transition: all 0.2s;

  &:hover {
    border-color: #0070f3;
    color: #0070f3;
    background: #f0f7ff;
  }
`;

export function PopularCities() {
  const cities = [
    "Hamburg",
    "Berlin",
    "München",
    "Köln",
    "Frankfurt",
    "Dortmund",
  ];
  return (
    <section style={{ padding: "60px 20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
        Beliebte Städte
      </h3>
      <CityGrid>
        {cities.map((city) => (
          <CityLink key={city} href={`/search?q=${city}`}>
            {city}
          </CityLink>
        ))}
      </CityGrid>
    </section>
  );
}
