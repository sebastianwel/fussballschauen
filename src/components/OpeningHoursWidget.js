"use client";

import { useState } from "react";
import styled from "styled-components";
import { updateBarData } from "@/actions/updateBarData";

// --- STYLES ---
const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.95rem;
  color: #334155;

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: #0f172a;
    font-weight: 700;
  }
`;

const EditArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #0070f3;
  }
`;

const SaveButton = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  margin-top: 12px;
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    background: #16a34a;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background: #cbd5e1;
  }
`;

// --- HELPER FUNKTION ---
const parseHoursData = (rawData) => {
  if (!rawData) return [];

  // Versuch 1: Ist es ein JSON-Array (dein aktueller Fall)?
  try {
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Kein JSON, also weiter zu Versuch 2
  }

  // Versuch 2: Normaler Text mit Zeilenumbrüchen
  return rawData.split("\n").filter((line) => line.trim() !== "");
};

// --- KOMPONENTE ---
export default function OpeningHoursWidget({ bar, isAdmin }) {
  const [loading, setLoading] = useState(false);
  const rawHours = bar.opening_hours || "";

  // Für den Editor bereiten wir die Daten als lesbaren Text auf
  const [tempHours, setTempHours] = useState(() => {
    const parsed = parseHoursData(rawHours);
    return parsed.join("\n");
  });

  const handleSave = async () => {
    setLoading(true);
    const result = await updateBarData(bar.id, { opening_hours: tempHours });
    if (result.success) {
      alert("Öffnungszeiten erfolgreich aktualisiert! ✅");
    } else {
      alert("Fehler beim Speichern: " + result.error);
    }
    setLoading(false);
  };

  const lines = parseHoursData(rawHours);

  return (
    <Card>
      {isAdmin ? (
        <>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 800,
              color: "#64748b",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            Öffnungszeiten bearbeiten
          </label>
          <EditArea
            value={tempHours}
            onChange={(e) => setTempHours(e.target.value)}
            placeholder="Montag: 18:00 - 01:00&#10;Dienstag: Geschlossen..."
          />
          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "Speichert..." : "Änderungen speichern"}
          </SaveButton>
        </>
      ) : (
        <List>
          {lines.length > 0 ? (
            lines.map((line, i) => {
              // Wir versuchen den Tag (vor dem Doppelpunkt) fett zu machen
              const parts = line.split(":");
              const day = parts[0];
              const time = parts.slice(1).join(":"); // Falls die Zeit auch Doppelpunkte hat

              return (
                <ListItem key={i}>
                  <strong>{day}</strong>
                  <span>{time.trim()}</span>
                </ListItem>
              );
            })
          ) : (
            <div style={{ color: "#94a3b8", fontStyle: "italic" }}>
              Keine Zeiten hinterlegt.
            </div>
          )}
        </List>
      )}
    </Card>
  );
}
