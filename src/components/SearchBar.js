"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouter, useSearchParams } from "next/navigation";

// --- STYLES (bleiben gleich) ---
const SearchWrapper = styled.div`
  background: white;
  padding: 8px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #eee;
  position: relative;
  z-index: 20;
`;
const Input = styled.input`
  flex: 1;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  outline: none;
  border-radius: 50px;
  color: #333;
  &::placeholder {
    color: #aaa;
  }
`;
const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #eee;
  margin: 0 10px;
`;
const LocateButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  color: #666;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #f5f5f5;
    color: #0070f3;
  }
  &:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`;
const SearchButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.2s;
  &:hover {
    background: #005bb5;
  }
`;

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loadingLoc, setLoadingLoc] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Wenn in der URL ein Ort steht (q=...), übernehmen wir den ins Feld
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation)
      return alert("Browser unterstützt keine Ortung.");

    setLoadingLoc(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // 1. REVERSE GEOCODING: Koordinaten -> Ortsname
          // Wir nutzen die kostenlose Nominatim API von OpenStreetMap
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          // Wir bauen uns einen schönen Namen zusammen (z.B. "Hamburg, Mitte" oder nur "Hamburg")
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet;
          const district = data.address.suburb || data.address.neighbourhood;

          let locationName = city || "Mein Standort";
          if (city && district) locationName = `${city}, ${district}`;

          // 2. Ins Suchfeld schreiben
          setQuery(locationName);

          // 3. Weiterleiten (mit Name UND Koordinaten)
          router.push(
            `/search?q=${encodeURIComponent(locationName)}&lat=${latitude}&lng=${longitude}&u=true`,
          );
        } catch (error) {
          console.error("Fehler bei der Ortserkennung:", error);
          // Fallback: Nur Koordinaten
          router.push(`/search?lat=${latitude}&lng=${longitude}&u=true`);
        } finally {
          setLoadingLoc(false);
        }
      },
      (err) => {
        alert("Standort konnte nicht ermittelt werden.");
        setLoadingLoc(false);
      },
    );
  };

  return (
    <SearchWrapper>
      <Input
        placeholder="Stadt, PLZ oder Bar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Divider />
      <LocateButton
        onClick={handleLocateMe}
        disabled={loadingLoc}
        title="Standort ermitteln"
      >
        {loadingLoc ? (
          // Kleiner Loading Spinner
          <div
            style={{
              width: 20,
              height: 20,
              border: "2px solid #ccc",
              borderTopColor: "#0070f3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <svg
            width="20"
            height="20"
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
      </LocateButton>
      <SearchButton onClick={handleSearch}>Los</SearchButton>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </SearchWrapper>
  );
}
