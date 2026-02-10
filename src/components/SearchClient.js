"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import MapBarList from "@/components/MapBarList";
import MapWrapper from "@/components/MapWrapper";
import SearchBar from "@/components/SearchBar";
import { COMPETITIONS } from "@/lib/constants"; // Wir nutzen deine vorhandenen Wettbewerbe

// --- STYLES ---

const MainContainer = styled.main`
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  background: #f8f9fa;
  position: relative;
`;

const ListPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  z-index: 20;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  transform: ${(props) =>
    props.$isMapOpen ? "translateX(-100%)" : "translateX(0)"};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (min-width: 768px) {
    position: static;
    transform: none;
    width: 450px;
    min-width: 350px;
    border-right: 1px solid #ddd;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  }
`;

const MapPanel = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 10;
`;

// --- NEU: FILTER STYLES ---
const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 20px;
  background: white;
  border-bottom: 1px solid #f0f0f0;

  /* Scrollbar verstecken */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const FilterChip = styled.button`
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$active ? "#0070f3" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#0070f3" : "white")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  transition: all 0.2s;

  &:hover {
    border-color: #0070f3;
    color: ${(props) => (props.$active ? "white" : "#0070f3")};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: ${(props) => (props.$isMapOpen ? "auto" : "30px")};
  top: ${(props) =>
    props.$isMapOpen ? "max(15px, env(safe-area-inset-top, 15px))" : "auto"};
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 50px;
  font-weight: 700;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    display: none;
  }
`;

// --- COMPONENT ---

export default function SearchClient({
  bars,
  query,
  initialLat,
  initialLng,
  isUserLocation,
}) {
  const [selectedBarId, setSelectedBarId] = useState(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  // --- NEU: FILTER STATE ---
  const [activeFilter, setActiveFilter] = useState(null); // Speichert die Wettbewerbs-ID (z.B. 'bundesliga')

  const router = useRouter();
  const searchParams = useSearchParams();

  // --- NEU: FILTER LOGIK ---
  const filteredBars = useMemo(() => {
    if (!activeFilter) return bars;

    return bars.filter((bar) => {
      // Wir prüfen, ob der Wettbewerb in den competition_votes existiert
      // und ob er mehr als 0 Stimmen hat
      return bar.competition_votes && bar.competition_votes[activeFilter] > 0;
    });
  }, [bars, activeFilter]);

  const handleListClick = (barId, slug) => {
    if (selectedBarId === barId) {
      const currentParams = searchParams.toString();
      router.push(
        `/bar/${slug}?return_to=${encodeURIComponent(currentParams)}`,
      );
    } else {
      setSelectedBarId(barId);
    }
  };

  const handleMapMarkerClick = (barId) => {
    setSelectedBarId(barId);
  };

  const toggleView = () => setShowMapMobile(!showMapMobile);

  const center = initialLat && initialLng ? [initialLat, initialLng] : null;

  return (
    <MainContainer>
      {/* LINKE SPALTE (Liste) */}
      <ListPanel $isMapOpen={showMapMobile}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1a1a1a" }}>
            <h1
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                marginBottom: "16px",
              }}
            >
              ⚽️ FUSSBALLSCHAUEN
            </h1>
          </Link>

          <SearchBar initialQuery={query} />

          <div style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
            <strong>{filteredBars.length}</strong> Treffer{" "}
            {query && `für "${query}"`}
          </div>
        </div>

        {/* --- NEU: DIE FILTER LEISTE --- */}
        <FilterContainer>
          <FilterChip
            $active={activeFilter === null}
            onClick={() => setActiveFilter(null)}
          >
            Alle
          </FilterChip>
          {COMPETITIONS.map((comp) => (
            <FilterChip
              key={comp.id}
              $active={activeFilter === comp.id}
              onClick={() =>
                setActiveFilter(comp.id === activeFilter ? null : comp.id)
              }
            >
              {comp.name}
            </FilterChip>
          ))}
        </FilterContainer>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <MapBarList
            bars={filteredBars} // WICHTIG: Hier die gefilterten Bars nutzen
            selectedBarId={selectedBarId}
            onBarClick={handleListClick}
          />
        </div>
      </ListPanel>

      {/* RECHTE SPALTE (Karte) */}
      <MapPanel>
        <MapWrapper
          bars={filteredBars} // WICHTIG: Auch die Karte zeigt nur die gefilterten Bars
          center={center}
          showUserMarker={isUserLocation}
          selectedBarId={selectedBarId}
          onMarkerClick={handleMapMarkerClick}
        />
      </MapPanel>

      <ToggleButton $isMapOpen={showMapMobile} onClick={toggleView}>
        {showMapMobile ? (
          <>
            <span role="img">📜</span> Liste
          </>
        ) : (
          <>
            <span role="img">🗺️</span> Karte
          </>
        )}
      </ToggleButton>
    </MainContainer>
  );
}
