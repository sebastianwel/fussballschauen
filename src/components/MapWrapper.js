"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
      }}
    >
      Lade Karte...
    </div>
  ),
});

export default function MapWrapper({
  bars,
  center,
  showUserMarker,
  selectedBarId,
  onMarkerClick,
}) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Map
        bars={bars}
        initialCenter={center}
        showUserMarker={showUserMarker}
        selectedBarId={selectedBarId}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
}
