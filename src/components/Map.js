"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styled, { keyframes } from "styled-components";
import Link from "next/link";

// --- STYLES ---
const slideUp = keyframes`from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;
const BottomCard = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;
const CloseButton = styled.button`
  position: absolute;
  top: -12px;
  right: -12px;
  background: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  &:hover {
    color: #333;
    transform: scale(1.1);
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

const userIcon = L.divIcon({
  className: "user-location-pin",
  html: `<div style="position: relative; width: 20px; height: 20px;"><div style="position: absolute; top: 0; left: 0; width: 16px; height: 16px; background-color: #4285F4; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3); z-index: 2;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// --- CONTROLLER: BEWEGT DIE KARTE ---
function MapController({ center, zoom, selectedBarId, bars }) {
  const map = useMap();

  // 1. Initiale Position
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);

  // 2. FlyTo bei Auswahl
  useEffect(() => {
    if (selectedBarId) {
      const bar = bars.find((b) => b.id === selectedBarId);
      if (bar && bar.lat && bar.lng) {
        map.flyTo([bar.lat, bar.lng], 16, { duration: 1.5 });
      }
    }
  }, [selectedBarId, bars, map]);

  return null;
}

// --- MAIN COMPONENT ---
export default function Map({
  bars,
  initialCenter,
  showUserMarker,
  selectedBarId,
  onMarkerClick,
}) {
  // Finde die aktive Bar für die BottomCard
  const activeBar = bars.find((b) => b.id === selectedBarId);

  const defaultCenter = [51.1657, 10.4515];
  const mapCenter = initialCenter || defaultCenter;
  const zoomLevel = initialCenter ? 14 : 6;

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
        />

        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* User Marker */}
        {showUserMarker && initialCenter && (
          <Marker
            position={initialCenter}
            icon={userIcon}
            interactive={false}
            zIndexOffset={500}
          />
        )}

        {/* Bars */}
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

      {/* Vorschau Karte unten */}
      {activeBar && (
        <BottomCard>
          <CloseButton onClick={() => onMarkerClick(null)}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </CloseButton>

          <div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>
              {activeBar.name}
            </h3>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>
              {activeBar.features?.sky ? "📺 Sky " : ""}
              {activeBar.features?.dazn ? "⚽ DAZN " : ""}
              {!activeBar.features?.sky &&
                !activeBar.features?.dazn &&
                "🍺 Bar"}
            </div>
          </div>

          <Link
            href={`/bar/${activeBar.slug}`}
            style={{
              background: "#f5f5f5",
              padding: "10px 16px",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#333",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            Ansehen →
          </Link>
        </BottomCard>
      )}
    </div>
  );
}
