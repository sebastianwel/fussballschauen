"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { voteCompetition } from "@/actions/voteCompetition";
import { COMPETITIONS } from "@/lib/constants";

// --- STYLES ---
const Container = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

const Header = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;

  &:hover {
    background: #fafafa;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Arrow = styled.span`
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
  font-size: 1.2rem;
  color: #888;
`;

const Content = styled.div`
  padding: 20px;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  background: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const VoteButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  cursor: ${(props) => (props.$hasVoted ? "default" : "pointer")};
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  min-height: 70px; /* Einheitliche Höhe */

  /* Styling Logik */
  background: ${(props) =>
    props.$hasVoted
      ? "#f0fdf4" // Ganz helles Grün wenn selbst gevotet
      : props.$count > 0
        ? "#fff" // Weiß bei Votes
        : props.$isOfficial
          ? "#f8fafc" // Hellblau-Grau bei offiziell
          : "#f9f9f9"};

  border: 1px solid
    ${(props) =>
      props.$hasVoted
        ? "#86efac"
        : props.$count > 0
          ? "#cbd5e1" // Dunklerer Rand wenn Votes da sind
          : props.$isOfficial
            ? "#e2e8f0"
            : "#eee"};

  /* Hover Effekt nur wenn noch nicht gevotet */
  &:hover {
    transform: ${(props) => (props.$hasVoted ? "none" : "translateY(-2px)")};
    background: ${(props) => (props.$hasVoted ? "#f0fdf4" : "#fff")};
    box-shadow: ${(props) =>
      props.$hasVoted ? "none" : "0 4px 10px rgba(0,0,0,0.05)"};
    border-color: ${(props) => (props.$hasVoted ? "#86efac" : "#94a3b8")};
  }
`;

const CompName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const StatusLine = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
`;

export default function CompetitionVoting({ bar }) {
  const [votes, setVotes] = useState(bar.competition_votes || {});
  const [loading, setLoading] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    // Prüfen, ob User schon gevotet hat (localStorage)
    const storageKey = `votes_${bar.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setUserVotes(JSON.parse(stored));
    }
  }, [bar.id]);

  const officialList = bar.shown_competitions || [];

  async function handleVote(compId) {
    if (loading || userVotes[compId]) return;

    setLoading(compId);

    // Optimistic Update
    const newCount = (votes[compId] || 0) + 1;
    setVotes({ ...votes, [compId]: newCount });

    const newUserVotes = { ...userVotes, [compId]: true };
    setUserVotes(newUserVotes);
    localStorage.setItem(`votes_${bar.id}`, JSON.stringify(newUserVotes));

    try {
      await voteCompetition(bar.id, compId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  }

  // Sortierung: Hohe Votes nach oben
  const sortedCompetitions = [...COMPETITIONS].sort((a, b) => {
    const countA = votes[a.id] || 0;
    const countB = votes[b.id] || 0;

    // Wenn beide 0 haben, sortiere nach "offiziell gelistet"
    if (countA === 0 && countB === 0) {
      const offA = officialList.includes(a.id) ? 1 : 0;
      const offB = officialList.includes(b.id) ? 1 : 0;
      return offB - offA;
    }

    return countB - countA;
  });

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <Container>
      <Header onClick={() => setIsOpen(!isOpen)}>
        <Title>
          📺 Live-Programm
          {totalVotes > 0 && (
            <span
              style={{
                fontSize: "0.75rem",
                background: "#e0f2fe",
                color: "#0284c7",
                padding: "2px 8px",
                borderRadius: "50px",
              }}
            >
              {totalVotes} Bestätigungen
            </span>
          )}
        </Title>
        <Arrow $isOpen={isOpen}>▼</Arrow>
      </Header>

      <Content $isOpen={isOpen}>
        <p
          style={{
            marginTop: 0,
            marginBottom: "15px",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          Tippe auf einen Wettbewerb, um ihn zu bestätigen.
        </p>

        <Grid>
          {sortedCompetitions.map((comp) => {
            const count = votes[comp.id] || 0;
            const isOfficial = officialList.includes(comp.id);
            const hasUserVoted = userVotes[comp.id];

            return (
              <VoteButton
                key={comp.id}
                onClick={() => handleVote(comp.id)}
                disabled={hasUserVoted || loading !== null}
                $hasVoted={hasUserVoted}
                $count={count}
                $isOfficial={isOfficial}
              >
                <CompName>{comp.name}</CompName>

                <StatusLine>
                  {hasUserVoted ? (
                    <span style={{ color: "#15803d" }}>
                      ✅ Du hast bestätigt ({count})
                    </span>
                  ) : count > 0 ? (
                    <span style={{ color: "#166534" }}>
                      {/* HIER IST DIE ÄNDERUNG: FETTE ZAHL */}
                      <b style={{ fontWeight: "800" }}>{count}x</b> bestätigt
                    </span>
                  ) : // Wenn 0 Votes:
                  isOfficial ? (
                    "ℹ️ Laut Eintrag"
                  ) : (
                    "Vote abgeben"
                  )}
                </StatusLine>
              </VoteButton>
            );
          })}
        </Grid>
      </Content>
    </Container>
  );
}
