"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import MapBarList from "@/components/MapBarList";
import MapWrapper from "@/components/MapWrapper";
import SearchBar from "@/components/SearchBar";
import TeamSelector from "@/components/TeamSelector";
import { COMPETITIONS } from "@/lib/constants";

// --- STYLES (Unverändert übernommen) ---
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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

const ChipScroll = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 20px;
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
`;

const TeamSearchWrapper = styled.div`
  padding: 0 20px 12px 20px;
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

// --- INNER COMPONENT (um useSearchParams sicher zu nutzen) ---
function SearchContent({
  bars,
  query,
  initialLat,
  initialLng,
  isUserLocation,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- STATE ---
  // Wir initialisieren den Filter direkt aus der URL (?filter=bundesliga)
  const [activeFilter, setActiveFilter] = useState(
    () => searchParams.get("filter") || null,
  );
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamSearch, setShowTeamSearch] = useState(false);
  const [selectedBarId, setSelectedBarId] = useState(null);
  const [showMapMobile, setShowMapMobile] = useState(false);

  // Sync bei URL-Änderung (z.B. Klick auf HomeQuickFilter)
  useEffect(() => {
    const filterFromUrl = searchParams.get("filter");
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
      setSelectedTeam(null);
    }
  }, [searchParams]);

  // --- FILTER LOGIK ---
  const filteredBars = useMemo(() => {
    let result = bars;

    // 1. Filter nach Wettbewerb (ID muss mit constants.js übereinstimmen)
    if (activeFilter) {
      result = result.filter((bar) => {
        const votes = bar.competition_votes;
        return votes && typeof votes === "object" && votes[activeFilter] > 0;
      });
    }

    // 2. Filter nach Team (Heimteam)
    if (selectedTeam) {
      result = result.filter(
        (bar) =>
          bar.home_team &&
          bar.home_team.toLowerCase().includes(selectedTeam.toLowerCase()),
      );
    }

    return result;
  }, [bars, activeFilter, selectedTeam]);

  // --- KARTE ZENTRIEREN ---
  const mapCenter = useMemo(() => {
    if (selectedBarId) {
      const selectedBar = bars.find((b) => b.id === selectedBarId);
      if (selectedBar) return [selectedBar.lat, selectedBar.lng];
    }
    if (filteredBars.length > 0) {
      return [filteredBars[0].lat, filteredBars[0].lng];
    }
    if (initialLat && initialLng) {
      return [initialLat, initialLng];
    }
    return [51.16336, 10.44768];
  }, [filteredBars, selectedBarId, initialLat, initialLng, bars]);

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

  return (
    <MainContainer>
      <ListPanel $isMapOpen={showMapMobile}>
        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
          <SearchBar initialQuery={query} />
          <div
            style={{ marginTop: "15px", fontSize: "0.9rem", color: "#64748b" }}
          >
            <strong>{filteredBars.length}</strong> Treffer{" "}
            {query && `für "${query}"`}
            {selectedTeam && ` (Fans von ${selectedTeam})`}
          </div>
        </div>

        <FilterContainer>
          <ChipScroll>
            <FilterChip
              $active={activeFilter === null && !selectedTeam}
              onClick={() => {
                setActiveFilter(null);
                setSelectedTeam(null);
                setShowTeamSearch(false);
                router.push("/search"); // URL aufräumen
              }}
            >
              Alle
            </FilterChip>

            <FilterChip
              $active={showTeamSearch || selectedTeam}
              onClick={() => {
                setShowTeamSearch(!showTeamSearch);
                setActiveFilter(null);
              }}
            >
              {selectedTeam ? `🏠 ${selectedTeam}` : "🔍 Team-Filter"}
            </FilterChip>

            {COMPETITIONS.map((comp) => (
              <FilterChip
                key={comp.id}
                $active={activeFilter === comp.id}
                onClick={() => {
                  const newFilter = activeFilter === comp.id ? null : comp.id;
                  setActiveFilter(newFilter);
                  setSelectedTeam(null);
                  setShowTeamSearch(false);
                  // URL synchronisieren
                  if (newFilter) router.push(`/search?filter=${newFilter}`);
                  else router.push("/search");
                }}
              >
                {comp.name}
              </FilterChip>
            ))}
          </ChipScroll>

          {showTeamSearch && (
            <TeamSearchWrapper>
              <TeamSelector
                value={selectedTeam}
                onChange={(team) => {
                  setSelectedTeam(team);
                  if (team) setActiveFilter(null);
                }}
              />
              {selectedTeam && (
                <button
                  onClick={() => setSelectedTeam(null)}
                  style={{
                    marginTop: "8px",
                    background: "none",
                    border: "none",
                    color: "#0070f3",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Suche zurücksetzen
                </button>
              )}
            </TeamSearchWrapper>
          )}
        </FilterContainer>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <MapBarList
            bars={filteredBars}
            selectedBarId={selectedBarId}
            onBarClick={handleListClick}
          />
        </div>
      </ListPanel>

      <MapPanel>
        <MapWrapper
          bars={filteredBars}
          center={mapCenter}
          showUserMarker={isUserLocation}
          selectedBarId={selectedBarId}
          onMarkerClick={setSelectedBarId}
        />
      </MapPanel>

      <ToggleButton
        $isMapOpen={showMapMobile}
        onClick={() => setShowMapMobile(!showMapMobile)}
      >
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

// Export mit Suspense (notwendig für useSearchParams in Next.js)
export default function SearchClient(props) {
  return (
    <Suspense fallback={<div>Lade Suche...</div>}>
      <SearchContent {...props} />
    </Suspense>
  );
}
