"use client";

import styled from "styled-components";

const StatsBanner = styled.div`
  background: #0f172a;
  color: white;
  padding: 40px 20px;
  border-radius: 24px;
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
  text-align: center;
`;

const StatItem = styled.div`
  .number {
    display: block;
    font-size: 2.5rem;
    font-weight: 900;
    margin-bottom: 5px;
    background: linear-gradient(135deg, #60a5fa 0%, #0070f3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
    color: #94a3b8;
  }
`;

const LivePulse = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #10b981;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

// --- DYNAMISCHE VERSION ---
export function CommunityStats({ barsCount }) {
  // Wir simulieren eine Aktivität basierend auf der Bar-Anzahl
  // Beispiel: Im Schnitt 32 Bestätigungen pro Bar + ein Basiswert
  const calculatedVotes =
    barsCount > 0 ? (barsCount * 1 + 15).toLocaleString("de-DE") : "Live";

  return (
    <div style={{ padding: "0 20px" }}>
      <StatsBanner>
        <StatItem>
          <span className="number">{barsCount || "0"}</span>
          <span className="label">Bars im System</span>
        </StatItem>
        <StatItem>
          <span className="number">
            <LivePulse /> {calculatedVotes}
          </span>
          <span className="label">Bestätigte Spiele</span>
        </StatItem>
        <StatItem>
          <span className="number">100%</span>
          <span className="label">Community Power</span>
        </StatItem>
      </StatsBanner>
    </div>
  );
}
