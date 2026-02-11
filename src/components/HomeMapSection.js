"use client";

import { useState } from "react";
import MapWrapper from "@/components/MapWrapper";

export default function HomeMapSection({ barsWithGeo }) {
  const [selectedBarId, setSelectedBarId] = useState(null);

  return (
    <div
      style={{
        height: "400px",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        border: "4px solid white",
        position: "relative",
      }}
    >
      <MapWrapper
        bars={barsWithGeo}
        selectedBarId={selectedBarId}
        onMarkerClick={setSelectedBarId}
      />
    </div>
  );
}
