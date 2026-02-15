"use client";

import { useState, useMemo } from "react";
import styled from "styled-components";
import Link from "next/link";

// --- STYLES ---

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
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

// --- OPTIMIERTE PAGINATION STYLES ---
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 0 10px 40px 10px;
  flex-wrap: wrap; /* Erlaubt Umbruch auf sehr schmalen Handys */
  width: 100%;
  box-sizing: border-box;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  min-width: 40px; /* Macht Buttons quadratischer/griffiger */
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$active ? "#0070f3" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#0070f3" : "white")};
  color: ${(props) => (props.$active ? "white" : "#0f172a")};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: #0070f3;
    color: ${(props) => (props.$active ? "white" : "#0070f3")};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// --- KOMPONENTE ---

export default function BarList({ bars, selectedBarId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Pagination Logik: Berechnet welche Nummern angezeigt werden
  const visiblePages = useMemo(() => {
    const total = Math.ceil(bars.length / itemsPerPage);
    if (total <= 5) return [...Array(total)].map((_, i) => i + 1);

    // Logik für Fenster (zeigt 5 Seiten um die aktuelle herum)
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= total - 2)
      return [total - 4, total - 3, total - 2, total - 1, total];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  }, [bars.length, currentPage]);

  if (!bars || bars.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
        Keine Bars gefunden.
      </div>
    );
  }

  const totalPages = Math.ceil(bars.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBars = bars.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optional: Scrollt nach oben zum Anfang der Liste
    const element = document.getElementById("test");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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

      {/* SMART PAGINATION */}
      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹
          </PageButton>

          {/* Nur die berechneten sichtbaren Seiten mappen */}
          {visiblePages.map((page) => (
            <PageButton
              key={page}
              $active={currentPage === page}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ›
          </PageButton>
        </PaginationWrapper>
      )}
    </>
  );
}
