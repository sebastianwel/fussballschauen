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

export function CommunityStats({ barsCount }) {
  return (
    <div style={{ padding: "0 20px" }}>
      <StatsBanner>
        <StatItem>
          <span className="number">{barsCount || "0"}</span>
          <span className="label">Bars im Verzeichnis</span>
        </StatItem>

        <StatItem>
          <span className="number">9</span>
          <span className="label">Wettbewerbe im Blick</span>
        </StatItem>

        <StatItem>
          <span className="number">Beta</span>
          <span className="label">Status: Im Aufbau</span>
        </StatItem>
      </StatsBanner>
    </div>
  );
}
