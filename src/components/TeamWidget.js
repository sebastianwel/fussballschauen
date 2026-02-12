"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import TeamSelector from "@/components/TeamSelector";
import { updateHomeTeam } from "@/actions/updateHomeTeam";

// --- STYLES ---
const WidgetCard = styled.div`
  background: ${(props) =>
    props.$isAdmin
      ? "#fff"
      : "linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%)"};
  border: ${(props) =>
    props.$isAdmin ? "2px solid #0070f3" : "1px solid #e1e4e8"};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const TeamName = styled.h3`
  font-size: 1.6rem;
  color: #0f172a;
  margin: 0.5rem 0;
  font-weight: 800;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) => {
    if (props.$type === "owner") return "#eff6ff"; // Blau für Inhaber
    if (props.$type === "verified") return "#dcfce7"; // Grün für Fans verifiziert
    return "#fffbeb"; // Gelb für unbestätigt
  }};
  color: ${(props) => {
    if (props.$type === "owner") return "#1d4ed8";
    if (props.$type === "verified") return "#166534";
    return "#b45309";
  }};
  border: 1px solid
    ${(props) => {
      if (props.$type === "owner") return "#bfdbfe";
      if (props.$type === "verified") return "#86efac";
      return "#fcd34d";
    }};
`;

const AdminActionBtn = styled.button`
  background: ${(props) => (props.$secondary ? "transparent" : "#0070f3")};
  color: ${(props) => (props.$secondary ? "#64748b" : "white")};
  border: ${(props) => (props.$secondary ? "1px solid #cbd5e1" : "none")};
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 15px;
  &:hover {
    opacity: 0.9;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0;
  color: #1a1a1a;
`;

// --- KOMPONENTE ---

export default function TeamWidget({ bar, isAdmin }) {
  const [team, setTeam] = useState(bar.home_team);
  const [votes, setVotes] = useState(bar.home_team_votes || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem(`team_vote_${bar.id}`);
    if (voted) setHasVoted(true);
  }, [bar.id]);

  // Funktion für Inhaber & Fans
  const handleSave = async (selectedTeam) => {
    setLoading(true);
    // Optimistic UI
    setTeam(selectedTeam);
    setIsEditing(false);

    // Server Action
    // Falls isAdmin true ist, könnte man in der Action die Votes direkt auf 100 setzen
    // oder ein Flag 'owner_confirmed' nutzen. Hier setzen wir das Team.
    await updateHomeTeam(bar.id, selectedTeam, true);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (hasVoted || isAdmin) return;
    setLoading(true);
    setVotes((prev) => prev + 1);
    setHasVoted(true);
    localStorage.setItem(`team_vote_${bar.id}`, "true");
    await updateHomeTeam(bar.id, null, false);
    setLoading(false);
  };

  // --- RENDERING ---

  // 1. EDIT-MODUS (Inhaber oder Fan will hinzufügen)
  if (isEditing) {
    return (
      <Section>
        <SectionTitle>🏟️ Stamm-Mannschaft festlegen</SectionTitle>
        <WidgetCard $isAdmin={isAdmin}>
          <TeamSelector
            value={newTeamName}
            onChange={(val) => setNewTeamName(val)}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <AdminActionBtn $secondary onClick={() => setIsEditing(false)}>
              Abbrechen
            </AdminActionBtn>
            <AdminActionBtn
              onClick={() => handleSave(newTeamName)}
              disabled={!newTeamName || loading}
            >
              {loading ? "Wird gespeichert..." : "Team festlegen"}
            </AdminActionBtn>
          </div>
        </WidgetCard>
      </Section>
    );
  }

  // 2. VIEW-MODUS (Team bereits vorhanden)
  if (team) {
    const isOwnerVerified = bar.is_claimed; // Wenn die Bar geclaimt ist, wiegt das Team schwerer
    const isFanVerified = votes >= 3;

    return (
      <section style={{ marginTop: "2rem" }}>
        <SectionTitle>🏟️ Stamm-Mannschaft</SectionTitle>
        <WidgetCard $isAdmin={isAdmin}>
          <TeamName>{team}</TeamName>

          <StatusBadge
            $type={
              isOwnerVerified
                ? "owner"
                : isFanVerified
                  ? "verified"
                  : "unconfirmed"
            }
          >
            {isOwnerVerified
              ? "💎 Inhaber-bestätigt"
              : isFanVerified
                ? "✅ Fan-verifiziert"
                : "⚠️ Unbestätigt"}
            {!isOwnerVerified && (
              <span>
                {" "}
                • {votes} {votes === 1 ? "Stimme" : "Stimmen"}
              </span>
            )}
          </StatusBadge>

          <div style={{ marginTop: "15px" }}>
            {isAdmin ? (
              <AdminActionBtn
                $secondary
                onClick={() => {
                  setIsEditing(true);
                  setNewTeamName(team);
                }}
              >
                ✏️ Team ändern
              </AdminActionBtn>
            ) : (
              !isOwnerVerified &&
              (!hasVoted ? (
                <button
                  onClick={handleConfirm}
                  style={{
                    background: "white",
                    border: "1px solid #22c55e",
                    color: "#22c55e",
                    padding: "8px 20px",
                    borderRadius: "20px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  👍 Stimmt!
                </button>
              ) : (
                <span
                  style={{
                    color: "#166534",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  Danke für deine Stimme!
                </span>
              ))
            )}
          </div>
        </WidgetCard>
      </section>
    );
  }

  // 3. INITIAL-MODUS (Kein Team da)
  return (
    <section style={{ marginTop: "2rem" }}>
      <SectionTitle>🏟️ Stamm-Mannschaft</SectionTitle>
      <WidgetCard $isAdmin={isAdmin}>
        <p style={{ color: "#64748b", marginBottom: "15px" }}>
          Bisher wurde kein Stammteam für diese Bar gemeldet.
        </p>
        <AdminActionBtn onClick={() => setIsEditing(true)}>
          {isAdmin ? "+ Team festlegen" : "+ Team vorschlagen"}
        </AdminActionBtn>
      </WidgetCard>
    </section>
  );
}

// Kleiner Hilfs-Style für die Abstände
const Section = styled.section`
  margin-top: 2rem;
`;
