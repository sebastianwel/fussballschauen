"use client";

import { useState } from "react";
import styled from "styled-components";
import { createClient } from "@supabase/supabase-js";

// --- STYLES ---
const WidgetCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%);
  border: 1px solid #e1e4e8;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const TeamName = styled.h3`
  font-size: 1.5rem;
  color: #1a1a1a;
  margin: 0.5rem 0;
  font-weight: 800;
`;

const Label = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  font-weight: 600;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: 2px solid #0070f3;
    border-color: transparent;
  }
`;

const SaveButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #005bb5;
  }
`;

const AddButton = styled.button`
  background: transparent;
  border: 1px dashed #bbb;
  color: #666;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 5px;
  &:hover {
    border-color: #0070f3;
    color: #0070f3;
    background: #f0f7ff;
  }
`;

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function TeamWidget({ barId, initialTeam }) {
  const [team, setTeam] = useState(initialTeam);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);

    // Update in Supabase
    const { error } = await supabase
      .from("bars")
      .update({ home_team: inputValue })
      .eq("id", barId);

    if (error) {
      alert("Fehler beim Speichern");
    } else {
      setTeam(inputValue);
      setIsEditing(false);
      // Kleiner Gamification Effekt
      alert(`🎉 Sauber! Du hast "${inputValue}" als Heimteam eingetragen.`);
    }
    setLoading(false);
  };

  // ZUSTAND 1: Team ist bekannt
  if (team) {
    return (
      <WidgetCard>
        <Label>Heimat von</Label>
        <div style={{ fontSize: "3rem", margin: "10px 0" }}>👕</div>
        <TeamName>{team}</TeamName>
        {/* Optional: Hier könnte man später "Falsch? Melden" einbauen */}
      </WidgetCard>
    );
  }

  // ZUSTAND 2: Eingabe-Modus
  if (isEditing) {
    return (
      <WidgetCard>
        <Label>Welches Team regiert hier?</Label>
        <InputGroup>
          <Input
            placeholder="z.B. Hamburger SV"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "..." : "Speichern"}
          </SaveButton>
        </InputGroup>
      </WidgetCard>
    );
  }

  // ZUSTAND 3: Kein Team, Button zum Eintragen
  return (
    <WidgetCard>
      <Label>Heim-Mannschaft</Label>
      <div style={{ margin: "15px 0", color: "#ccc", fontStyle: "italic" }}>
        Noch nicht eingetragen
      </div>
      <AddButton onClick={() => setIsEditing(true)}>
        + Team hinzufügen
      </AddButton>
    </WidgetCard>
  );
}
