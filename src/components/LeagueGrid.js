"use client";

import styled from "styled-components";
import Link from "next/link";
import { COMPETITIONS } from "@/lib/constants";

const Section = styled.section`
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 20px;
`;

const SectionHeader = styled.div`
  text-align: center;
  marginbottom: 40px;

  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 12px;
  }

  p {
    color: #64748b;
    font-size: 1.1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 40px;
`;

const LeagueCard = styled(Link)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: #0070f3;
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 112, 243, 0.08);

    .icon-wrapper {
      transform: scale(1.1);
      background: #eff6ff;
    }
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    background: #f8fafc;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    transition: all 0.3s ease;
  }

  .name {
    color: #1e293b;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.2;
  }
`;

// Wir mappen die IDs aus deiner constants.js auf passende Emojis
const LEAGUE_ICONS = {
  bundesliga: "🇩🇪",
  bundesliga2: "🥈",
  liga3: "🥉",
  dfb_pokal: "🏆",
  champions_league: "⭐️",
  europa_league: "🌍",
  conference_league: "⚽️",
  em_wm: "🌎",
  supercup: "🔥",
};

export function LeagueGrid() {
  return (
    <Section>
      <SectionHeader>
        <h2>Wähle deinen Wettbewerb</h2>
        <p>Finde Kneipen, die genau deine Liga live übertragen.</p>
      </SectionHeader>

      <Grid>
        {COMPETITIONS.map((comp) => (
          <LeagueCard key={comp.id} href={`/search?filter=${comp.id}`}>
            <div className="icon-wrapper">{LEAGUE_ICONS[comp.id] || "⚽️"}</div>
            <span className="name">{comp.name}</span>
          </LeagueCard>
        ))}
      </Grid>
    </Section>
  );
}
