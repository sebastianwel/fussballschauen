"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import TeamSelector from "@/components/TeamSelector";
import { updateHomeTeam } from "@/actions/updateHomeTeam";

// --- STYLES (Dein bestehendes Design) ---
const WidgetCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%);
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
`;

const TeamName = styled.h3`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0.5rem 0;
  font-weight: 800;
`;

const Label = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SaveButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  &:hover {
    background: #005bb5;
  }
  &:disabled {
    background: #ccc;
    cursor: default;
  }
`;

const AddButton = styled.button`
  background: white;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  font-weight: 600;
  &:hover {
    border-color: #0070f3;
    color: #0070f3;
    background: #f0f9ff;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(props) => (props.$verified ? "#dcfce7" : "#fffbeb")};
  color: ${(props) => (props.$verified ? "#166534" : "#b45309")};
  border: 1px solid ${(props) => (props.$verified ? "#86efac" : "#fcd34d")};
  margin-top: 5px;
`;

const ConfirmButton = styled.button`
  background: #fff;
  border: 1px solid #22c55e;
  color: #22c55e;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s;

  &:hover {
    background: #f0fdf4;
  }

  &:disabled {
    border-color: #e2e8f0;
    color: #94a3b8;
    background: #f8fafc;
    cursor: default;
  }
`;

export default function TeamWidget({ bar }) {
  const [team, setTeam] = useState(bar.home_team);
  const [votes, setVotes] = useState(bar.home_team_votes || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Check LocalStorage beim Laden
  useEffect(() => {
    const voted = localStorage.getItem(`team_vote_${bar.id}`);
    if (voted) setHasVoted(true);
  }, [bar.id]);

  // Funktion 1: Neues Team speichern
  const handleSaveNew = async () => {
    if (!newTeamName) return;
    setLoading(true);

    // Optimistic UI
    setTeam(newTeamName);
    setVotes(1);
    setIsEditing(false);
    setHasVoted(true);
    localStorage.setItem(`team_vote_${bar.id}`, "true");

    await updateHomeTeam(bar.id, newTeamName, true); // true = Neuer Eintrag
    setLoading(false);
  };

  // Funktion 2: Bestehendes Team bestätigen
  const handleConfirm = async () => {
    if (hasVoted) return;
    setLoading(true);

    // Optimistic UI
    setVotes((prev) => prev + 1);
    setHasVoted(true);
    localStorage.setItem(`team_vote_${bar.id}`, "true");

    await updateHomeTeam(bar.id, null, false); // false = Nur Vote hochzählen
    setLoading(false);
  };

  // Status-Logik: Ab 3 Stimmen gilt es als "Verifiziert"
  const isVerified = votes >= 3;

  // --- ZUSTAND 1: Team ist bekannt ---
  if (team) {
    return (
      <WidgetCard>
        <Label>Heimat von</Label>

        {/* Team Name */}
        <TeamName>{team}</TeamName>

        {/* Status Badge */}
        <StatusBadge $verified={isVerified}>
          {isVerified ? "✅ Verifiziert" : "⚠️ Unbestätigt"}
          <span>
            • {votes} {votes === 1 ? "Stimme" : "Stimmen"}
          </span>
        </StatusBadge>

        {/* Voting Bereich */}
        <div style={{ marginTop: "15px" }}>
          {!hasVoted ? (
            <ConfirmButton onClick={handleConfirm} disabled={loading}>
              👍 Stimmt, hier sind {team} Fans!
            </ConfirmButton>
          ) : (
            <div
              style={{
                color: "#166534",
                fontSize: "0.9rem",
                marginTop: "10px",
                fontWeight: "500",
              }}
            >
              Danke für deine Bestätigung!
            </div>
          )}
        </div>
      </WidgetCard>
    );
  }

  // --- ZUSTAND 2: Eingabe-Modus ---
  if (isEditing) {
    return (
      <WidgetCard>
        <Label>Welches Team regiert hier?</Label>

        <div style={{ textAlign: "left", marginTop: "10px" }}>
          {/* Hier nutzen wir deine neue Autocomplete Komponente */}
          <TeamSelector
            value={newTeamName}
            onChange={(val) => setNewTeamName(val)}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Abbrechen
          </button>
          <SaveButton
            onClick={handleSaveNew}
            disabled={loading || !newTeamName}
          >
            {loading ? "..." : "Speichern"}
          </SaveButton>
        </div>
      </WidgetCard>
    );
  }

  // --- ZUSTAND 3: Leer (Hinzufügen) ---
  return (
    <WidgetCard>
      <Label>Heim-Mannschaft</Label>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "15px" }}>
        Weißt du, welches Fan-Lager sich hier trifft?
      </p>
      <AddButton onClick={() => setIsEditing(true)}>
        + Team hinzufügen
      </AddButton>
    </WidgetCard>
  );
}
