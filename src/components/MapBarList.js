"use client";

import styled from "styled-components";
import { COMPETITIONS } from "@/lib/constants";

// --- STYLES ---

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 80px;
`;

const CardWrapper = styled.div`
  cursor: pointer;
  /* Spezial-Hintergrund für verifizierte Bars */
  background: ${(props) =>
    props.$isSelected ? "#f0f7ff" : props.$isClaimed ? "#fdfcf0" : "white"};

  border: 2px solid
    ${(props) =>
      props.$isSelected
        ? "#0070f3"
        : props.$isClaimed
          ? "#facc15"
          : "transparent"};

  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s;
  display: flex;
  gap: 15px;
  position: relative; /* Für das Badge-Positioning */

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const ImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  background: ${(props) =>
    props.$isClaimed
      ? "linear-gradient(135deg, #fef9c3 0%, #facc15 100%)"
      : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"};
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 1px solid ${(props) => (props.$isClaimed ? "#eab308" : "#eee")};
`;

const BarName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 4px 0;
  color: #1a1a1a;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const VerifiedIcon = styled.span`
  color: #eab308;
  font-size: 0.9rem;
`;

const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${(props) => {
    if (props.$type === "owner") return "#fef9c3"; // Gold für Inhaber-Bestätigung
    if (props.$type === "team") return "#dcfce7";
    return "#eff6ff";
  }};
  color: ${(props) => {
    if (props.$type === "owner") return "#854d0e";
    if (props.$type === "team") return "#166534";
    return "#1e40af";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$type === "owner") return "#fde047";
      if (props.$type === "team") return "#86efac";
      return "#dbeafe";
    }};
`;

// --- HELPER ---
const getTopCompetitions = (votes) => {
  if (!votes) return [];
  const entries = Object.entries(votes);
  if (entries.length === 0) return [];
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, 3).map(([id]) => {
    const compObj = COMPETITIONS?.find((c) => c.id === id);
    return compObj ? compObj.name : id;
  });
};

export default function MapBarList({ bars, selectedBarId, onBarClick }) {
  if (!bars || bars.length === 0) return null;

  // --- DIE LOGIK: SORTIERUNG ---
  const sortedBars = [...bars].sort((a, b) => {
    // 1. Verifizierte Bars nach ganz oben
    if (a.is_claimed && !b.is_claimed) return -1;
    if (!a.is_claimed && b.is_claimed) return 1;

    // 2. Innerhalb der Gruppe nach Score oder Alphabet
    return (b.verification_score || 0) - (a.verification_score || 0);
  });

  return (
    <Grid>
      {sortedBars.map((bar) => {
        const topComps = getTopCompetitions(bar.competition_votes);
        const homeTeam = bar.home_team;
        const isClaimed = bar.is_claimed;

        return (
          <CardWrapper
            key={bar.id}
            onClick={() => onBarClick(bar.id, bar.slug)}
            $isSelected={selectedBarId === bar.id}
            $isClaimed={isClaimed}
          >
            <ImagePlaceholder $isClaimed={isClaimed}>
              {isClaimed ? "🛡️" : homeTeam ? "🏠" : "🍺"}
            </ImagePlaceholder>

            <div style={{ flex: 1, minWidth: 0 }}>
              <BarName>
                {bar.name}
                {isClaimed && (
                  <VerifiedIcon title="Inhaber-verifiziert">💎</VerifiedIcon>
                )}
              </BarName>

              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                📍 {bar.city}{" "}
                {isClaimed && (
                  <span style={{ color: "#eab308", fontWeight: 700 }}>
                    • Top Partner
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {isClaimed && <Badge $type="owner">Offizielles Programm</Badge>}
                {homeTeam && <Badge $type="team">{homeTeam}</Badge>}
                {topComps.map((name, i) => (
                  <Badge key={i}>{name}</Badge>
                ))}
              </div>
            </div>
          </CardWrapper>
        );
      })}
    </Grid>
  );
}
