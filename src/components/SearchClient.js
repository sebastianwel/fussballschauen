"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MapBarList from "@/components/MapBarList";
import MapWrapper from "@/components/MapWrapper";
import SearchBar from "@/components/SearchBar";

export default function SearchClient({
  bars,
  query,
  initialLat,
  initialLng,
  isUserLocation,
}) {
  const [selectedBarId, setSelectedBarId] = useState(null);
  const router = useRouter();

  // --- LOGIK: Klick auf Liste ---
  const handleListClick = (barId, slug) => {
    if (selectedBarId === barId) {
      // Zweiter Klick auf das gleiche Element -> Zur Detailseite
      router.push(`/bar/${slug}`);
    } else {
      // Erster Klick -> Auf der Karte anzeigen (Vorschau)
      setSelectedBarId(barId);
    }
  };

  // --- LOGIK: Klick auf Karte ---
  const handleMapMarkerClick = (barId) => {
    setSelectedBarId(barId);
  };

  // Startpunkt der Karte (entweder User-Position oder null -> Map nimmt default)
  const center = initialLat && initialLng ? [initialLat, initialLng] : null;

  return (
    <main
      style={{
        display: "flex",
        height: "100vh", // WICHTIG: Volle Höhe für Split-Screen
        width: "100vw",
        overflow: "hidden", // Kein Scrollen der ganzen Seite
        background: "#f8f9fa",
      }}
    >
      {/* --- LINKE SPALTE: Liste (450px breit) --- */}
      <div
        style={{
          width: "450px",
          minWidth: "350px",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #ddd",
          background: "white",
          zIndex: 2,
          boxShadow: "4px 0 15px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header Area */}
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

          <SearchBar />

          <div style={{ marginTop: "15px", fontSize: "0.9rem", color: "#666" }}>
            <strong>{bars.length}</strong> Treffer {query && `für "${query}"`}
          </div>
        </div>

        {/* Scrollbare Liste */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <MapBarList
            bars={bars}
            selectedBarId={selectedBarId}
            onBarClick={handleListClick}
          />
        </div>
      </div>

      {/* --- RECHTE SPALTE: Karte (Restlicher Platz) --- */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapWrapper
          bars={bars}
          center={center}
          showUserMarker={isUserLocation}
          selectedBarId={selectedBarId}
          onMarkerClick={handleMapMarkerClick}
        />
      </div>
    </main>
  );
}
