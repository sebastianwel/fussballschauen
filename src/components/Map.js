"use client";

import { useState, useEffect, useCallback } from "react"; // useCallback hinzugefügt
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { COMPETITIONS } from "@/lib/constants";

// --- STYLES ---
const slideUp = keyframes`from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;

const BottomCard = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 24px 24px 34px 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    bottom: 24px;
    left: 24px;
    right: auto;
    width: 360px;
    border-radius: 20px;
    padding: 20px;
  }
`;

// ... (Header, BarName, StatusBadge, CloseButton, ContentBox, IconBox, InfoText, Label, Value, ViewButton Styles bleiben identisch)
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
`;
const BarName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.2;
`;
const StatusBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 2px 0;
  font-weight: 600;
  color: ${(props) => (props.$verified ? "#166534" : "#b45309")};
`;
const CloseButton = styled.button`
  background: #f5f5f5;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  cursor: pointer;
  flex-shrink: 0;
  &:hover {
    background: #eee;
    color: #333;
  }
`;
const ContentBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid #e2e8f0;
`;
const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
`;
const InfoText = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.span`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 2px;
`;
const Value = styled.span`
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
  line-height: 1.4;
`;
const ViewButton = styled(Link)`
  background: #0f172a;
  color: white;
  text-decoration: none;
  padding: 12px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 0.95rem;
  transition: transform 0.1s;
  &:active {
    transform: scale(0.98);
  }
`;

// --- ICONS ---
const createCustomIcon = (isSelected) => {
  if (!isSelected) {
    return L.divIcon({
      className: "default-pin",
      html: `<div style="background-color: #666; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  }
  return L.divIcon({
    className: "selected-pin",
    html: `<div style="background-color: #0070f3; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); border: 3px solid white; transform: scale(1.1);">📍</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// DER BLAUE DOT (User Location) mit Pulse-Effekt
const userIcon = L.divIcon({
  className: "user-location-pin",
  html: `
    <div style="position: relative; width: 20px; height: 20px;">
      <div style="position: absolute; top: 0; left: 0; width: 16px; height: 16px; background-color: #4285F4; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3); z-index: 2;"></div>
      <div style="position: absolute; top: -10px; left: -10px; width: 36px; height: 36px; background-color: rgba(66, 133, 244, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// --- HELPER ---
const getCompetitionString = (votes) => {
  if (!votes) return null;
  const entries = Object.entries(votes);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  const topList = entries.slice(0, 4).map(([id]) => {
    const comp = COMPETITIONS.find((c) => c.id === id);
    return comp ? comp.name : id;
  });
  return topList.join(", ");
};

// --- CONTROLLER ---
function MapController({ center, zoom, selectedBarId, bars, onLocationFound }) {
  const map = useMap();

  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);

  useEffect(() => {
    if (selectedBarId) {
      const bar = bars.find((b) => b.id === selectedBarId);
      if (bar && bar.lat && bar.lng) {
        map.flyTo([bar.lat, bar.lng], 16, { duration: 1.5 });
      }
    }
  }, [selectedBarId, bars, map]);

  // Lauschen auf Standort-Events
  useEffect(() => {
    map.on("locationfound", (e) => {
      onLocationFound(e.latlng);
    });
  }, [map, onLocationFound]);

  return null;
}

// --- LOCATE CONTROL ---
function LocateControl({ onLoadingChange }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleLocate = (e) => {
    L.DomEvent.disableClickPropagation(e.target);
    e.stopPropagation();

    setLoading(true);
    onLoadingChange(true);

    map.locate({ setView: true, maxZoom: 15 });

    map.once("locationfound", () => {
      setLoading(false);
      onLoadingChange(false);
    });

    map.once("locationerror", () => {
      setLoading(false);
      onLoadingChange(false);
      alert("Standort konnte nicht ermittelt werden.");
    });
  };

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLocate}
          style={{
            backgroundColor: "white",
            width: "40px",
            height: "40px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: loading ? "#0070f3" : "#333",
            borderRadius: "4px",
          }}
        >
          {loading ? (
            "..."
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function Map({
  bars,
  initialCenter,
  showUserMarker,
  selectedBarId,
  onMarkerClick,
}) {
  const [userPos, setUserPos] = useState(initialCenter || null);
  const activeBar = bars.find((b) => b.id === selectedBarId);

  const defaultCenter = [51.1657, 10.4515];
  const mapCenter = initialCenter || defaultCenter;
  const zoomLevel = initialCenter ? 14 : 6;

  // Callback um Infinite Loops zu vermeiden
  const handleLocationFound = useCallback((latlng) => {
    setUserPos(latlng);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController
          center={initialCenter}
          zoom={zoomLevel}
          selectedBarId={selectedBarId}
          bars={bars}
          onLocationFound={handleLocationFound}
        />
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <LocateControl onLoadingChange={() => {}} />

        {/* DER LIVE BLAUE PUNKT */}
        {userPos && (
          <Marker
            position={userPos}
            icon={userIcon}
            interactive={false}
            zIndexOffset={1000}
          />
        )}

        {bars.map((bar) => {
          if (!bar.lat || !bar.lng) return null;
          const isSelected = selectedBarId === bar.id;
          return (
            <Marker
              key={bar.id}
              position={[bar.lat, bar.lng]}
              icon={createCustomIcon(isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{ click: () => onMarkerClick(bar.id) }}
            />
          );
        })}
      </MapContainer>

      {/* --- BOTTOM CARD --- */}
      {activeBar &&
        (() => {
          const compString = getCompetitionString(activeBar.competition_votes);
          const isVerified = activeBar.verification_score > 4;
          return (
            <BottomCard>
              <Header>
                <div>
                  <BarName>{activeBar.name}</BarName>
                  <StatusBadge $verified={isVerified}>
                    {isVerified ? "✅ Verifiziert" : "Nicht verifiziert"}
                  </StatusBadge>
                </div>
                <CloseButton onClick={() => onMarkerClick(null)}>✕</CloseButton>
              </Header>
              <ContentBox>
                <IconBox>{compString ? "📺" : "🍺"}</IconBox>
                <InfoText>
                  <Label>{compString ? "Bestätigt für" : "Status"}</Label>
                  <Value>{compString || "Sportbar / Kneipe"}</Value>
                </InfoText>
              </ContentBox>
              <ViewButton href={`/bar/${activeBar.slug}`}>
                Details ansehen
              </ViewButton>
            </BottomCard>
          );
        })()}
    </div>
  );
}
