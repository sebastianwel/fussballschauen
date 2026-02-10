"use client";

import styled from "styled-components";
import { COMPETITIONS } from "@/lib/constants"; // Importiere deine Konstanten!

// --- STYLES ---
const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px;
`;

const CardWrapper = styled.div`
  cursor: pointer;
  background: ${(props) => (props.$isSelected ? "#f0f7ff" : "white")};
  border: 2px solid
    ${(props) => (props.$isSelected ? "#0070f3" : "transparent")};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  display: flex;
  gap: 15px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 1px solid #eee;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0; /* Wichtig für Text-Overflow */
`;

const BarName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 4px 0;
  color: #1a1a1a;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

// Dynamisches Badge Design
const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;

  /* Farben basierend auf Typ */
  background: ${(props) => (props.$type === "team" ? "#dcfce7" : "#eff6ff")};
  color: ${(props) => (props.$type === "team" ? "#166534" : "#1e40af")};
  border: 1px solid
    ${(props) => (props.$type === "team" ? "#86efac" : "#dbeafe")};
`;

// --- HELPER: Top Wettbewerbe finden ---
const getTopCompetitions = (votes) => {
  if (!votes) return [];
  const entries = Object.entries(votes);
  if (entries.length === 0) return [];

  // Sortieren nach Anzahl Stimmen
  entries.sort((a, b) => b[1] - a[1]);

  // Top 3 nehmen und Namen auflösen
  return entries.slice(0, 3).map(([id]) => {
    // Versuche den schönen Namen aus deiner Konstante zu finden
    // Falls du COMPETITIONS nicht importiert hast, definiere sie hier lokal oder nutze Fallback
    const compObj = COMPETITIONS ? COMPETITIONS.find((c) => c.id === id) : null;
    return compObj ? compObj.name : id;
  });
};

export default function MapBarList({ bars, selectedBarId, onBarClick }) {
  if (!bars || bars.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        <p>Keine Bars in diesem Bereich gefunden.</p>
      </div>
    );
  }

  return (
    <Grid>
      {bars.map((bar) => {
        // Daten vorbereiten
        const topComps = getTopCompetitions(bar.competition_votes);
        const homeTeam = bar.home_team;

        return (
          <CardWrapper
            key={bar.id}
            onClick={() => onBarClick(bar.id, bar.slug)}
            $isSelected={selectedBarId === bar.id}
          >
            <ImagePlaceholder>
              {/* Wenn Heimteam da ist, zeig Haus, sonst Bier */}
              {homeTeam ? "🏠" : "🍺"}
            </ImagePlaceholder>

            <Content>
              <BarName>{bar.name}</BarName>

              <Meta>
                📍 {bar.zip_code} {bar.city}
              </Meta>

              <Features>
                {/* 1. Heimteam Badge */}
                {homeTeam && <Badge $type="team">{homeTeam}</Badge>}

                {/* 2. Wettbewerb Badges */}
                {topComps.map((compName, index) => (
                  <Badge key={index} $type="comp">
                    {compName}
                  </Badge>
                ))}

                {/* Fallback wenn gar nichts da ist */}
                {!homeTeam && topComps.length === 0 && (
                  <span style={{ fontSize: "0.75rem", color: "#999" }}>
                    Noch keine Infos eingetragen
                  </span>
                )}
              </Features>

              {selectedBarId === bar.id && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#0070f3",
                    marginTop: "10px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Zum Profil <span style={{ fontSize: "1.1rem" }}>→</span>
                </div>
              )}
            </Content>
          </CardWrapper>
        );
      })}
    </Grid>
  );
}
