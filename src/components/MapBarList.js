"use client";

import styled from "styled-components";

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
  background: linear-gradient(135deg, #eee 0%, #ddd 100%);
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const BarName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 4px 0;
  color: #222;
  font-weight: 700;
`;
const Meta = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
`;
const Features = styled.div`
  display: flex;
  gap: 6px;
`;
const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(props) => props.$bg || "#eee"};
  color: ${(props) => props.$color || "#555"};
`;

export default function BarList({ bars, selectedBarId, onBarClick }) {
  if (!bars || bars.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
        Keine Bars gefunden.
      </div>
    );
  }

  return (
    <Grid>
      {bars.map((bar) => (
        <CardWrapper
          key={bar.id}
          onClick={() => onBarClick(bar.id, bar.slug)}
          $isSelected={selectedBarId === bar.id}
        >
          <ImagePlaceholder>🍺</ImagePlaceholder>
          <Content>
            <BarName>{bar.name}</BarName>
            <Meta>
              📍 {bar.zip_code} {bar.city}
            </Meta>
            <Features>
              {bar.features?.sky && (
                <Badge $bg="#e6f4ea" $color="#1e7e34">
                  Sky
                </Badge>
              )}
              {bar.features?.dazn && (
                <Badge $bg="#fff3cd" $color="#856404">
                  DAZN
                </Badge>
              )}
              {bar.home_team && (
                <Badge $bg="#eef" $color="#0044cc">
                  👕 {bar.home_team}
                </Badge>
              )}
            </Features>
            {selectedBarId === bar.id && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#0070f3",
                  marginTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Klicke erneut zum Öffnen →
              </div>
            )}
          </Content>
        </CardWrapper>
      ))}
    </Grid>
  );
}
