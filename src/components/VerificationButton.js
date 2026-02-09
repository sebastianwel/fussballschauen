"use client";

import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { createClient } from "@supabase/supabase-js";

// Supabase Init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function VerificationButton({ barId, feature, label, icon }) {
  const [voted, setVoted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showXP, setShowXP] = useState(false);

  // Check LocalStorage beim Laden
  useEffect(() => {
    const hasVoted = localStorage.getItem(`vote_${barId}_${feature}`);
    if (hasVoted) setVoted(true);
  }, [barId, feature]);

  const handleVote = async () => {
    if (voted) return;

    // 1. UI Update (Sofort Feedback geben)
    setVoted(true);
    setAnimating(true);
    setShowXP(true);

    // XP speichern (für Gamification Level)
    const currentXP = parseInt(localStorage.getItem("user_xp") || "0");
    localStorage.setItem("user_xp", currentXP + 10);
    localStorage.setItem(`vote_${barId}_${feature}`, "true");

    // 2. Datenbank Update
    const { error } = await supabase.from("verifications").insert([
      {
        bar_id: barId,
        feature_key: feature,
        vote_value: 1,
      },
    ]);

    if (error) console.error("Fehler beim Voten:", error);

    // Animation Cleanup
    setTimeout(() => setAnimating(false), 300);
    setTimeout(() => setShowXP(false), 1000);
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        onClick={handleVote}
        $voted={voted}
        $animating={animating}
        disabled={voted}
      >
        <Icon>{voted ? "✅" : icon}</Icon>
        <Label>{voted ? "Bestätigt" : label}</Label>
      </Button>
      {showXP && <XPFly>+10 XP</XPFly>}
    </div>
  );
}

// --- STYLES ---
const popAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => (props.$voted ? "#e6f4ea" : "#fff")};
  border: 1px solid ${(props) => (props.$voted ? "#34a853" : "#ddd")};
  padding: 8px 16px;
  border-radius: 50px;
  cursor: ${(props) => (props.$voted ? "default" : "pointer")};
  font-family: inherit;
  font-weight: 600;
  color: ${(props) => (props.$voted ? "#1e7e34" : "#555")};
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${(props) => (props.$voted ? "#e6f4ea" : "#f8f9fa")};
    transform: ${(props) => (props.$voted ? "none" : "translateY(-2px)")};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ${(props) =>
    props.$animating &&
    css`
      animation: ${popAnimation} 0.3s ease;
    `}
`;

const Icon = styled.span`
  font-size: 1.2rem;
`;

const Label = styled.span`
  font-size: 0.9rem;
`;

const XPFly = styled.span`
  position: absolute;
  top: -20px;
  right: 0;
  color: #34a853;
  font-weight: bold;
  font-size: 0.8rem;
  opacity: 0;
  animation: flyUp 1s ease forwards;

  @keyframes flyUp {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-20px);
      opacity: 0;
    }
  }
`;
