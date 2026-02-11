"use client";

import { useState } from "react"; // useState für die Seitenzahl
import styled from "styled-components";
import Link from "next/link";

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
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
  flex-wrap: wrap;
`;

const Badge = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(props) => props.$bg || "#eee"};
  color: ${(props) => props.$color || "#555"};
`;

// --- NEUE STYLES FÜR PAGINATION ---
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-bottom: 40px;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$active ? "#0070f3" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#0070f3" : "white")};
  color: ${(props) => (props.$active ? "white" : "#0f172a")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #0070f3;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default function BarList({ bars, selectedBarId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (!bars || bars.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
        Keine Bars gefunden.
      </div>
    );
  }

  // Berechnung der anzuzeigenden Bars
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBars = bars.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bars.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Grid id="test">
        {currentBars.map((bar) => (
          <Link
            key={bar.id}
            href={`/bar/${bar.slug}`}
            style={{ textDecoration: "none" }}
          >
            <CardWrapper $isSelected={selectedBarId === bar.id}>
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
              </Content>
            </CardWrapper>
          </Link>
        ))}
      </Grid>

      {/* PAGINATION NAVIGATION */}
      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Zurück
          </PageButton>

          {[...Array(totalPages)].map((_, i) => (
            <PageButton
              key={i + 1}
              $active={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}

          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Weiter
          </PageButton>
        </PaginationWrapper>
      )}
    </>
  );
}
