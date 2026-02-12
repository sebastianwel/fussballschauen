"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { voteCompetition } from "@/actions/voteCompetition";
import { updateBarData } from "@/actions/updateBarData"; // Unsere neue Allzweck-Action
import { COMPETITIONS } from "@/lib/constants";

// --- STYLES ---
const Container = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => (props.$isAdmin ? "#0070f3" : "#eee")};
`;

const Header = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${(props) => (props.$isAdmin ? "#f8fafc" : "#fff")};
  border-bottom: 1px solid #f0f0f0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 10px;
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
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  min-height: 70px;

  /* Styling Logik */
  background: ${(props) =>
    props.$isOfficial
      ? "#eff6ff" // Blau-Weiß für offiziell
      : props.$hasVoted
        ? "#f0fdf4"
        : "#f9f9f9"};

  border: 1px solid
    ${(props) =>
      props.$isOfficial
        ? "#bfdbfe" // Blauer Rand für Inhaber-Wahl
        : props.$hasVoted
          ? "#86efac"
          : "#eee"};

  &:hover {
    transform: translateY(-2px);
    border-color: #94a3b8;
  }
`;

const CompName = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 4px;
`;

const StatusLine = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// --- KOMPONENTE ---

export default function CompetitionVoting({ bar, isAdmin }) {
  const [votes, setVotes] = useState(bar.competition_votes || {});
  const [officialList, setOfficialList] = useState(
    bar.shown_competitions || [],
  );
  const [loading, setLoading] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [userVotes, setUserVotes] = useState({});

  useEffect(() => {
    const storageKey = `votes_${bar.id}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) setUserVotes(JSON.parse(stored));
  }, [bar.id]);

  // ADMIN-LOGIK: Wettbewerb umschalten
  async function handleAdminToggle(compId) {
    if (loading) return;
    setLoading(compId);

    let newList;
    if (officialList.includes(compId)) {
      newList = officialList.filter((id) => id !== compId);
    } else {
      newList = [...officialList, compId];
    }

    // Optimistic Update
    setOfficialList(newList);

    try {
      await updateBarData(bar.id, { shown_competitions: newList });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  }

  // FAN-LOGIK: Voten
  async function handleVote(compId) {
    if (loading || userVotes[compId] || isAdmin) return;
    setLoading(compId);

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

  // Sortierung: Admin-Wahl > Fan-Votes > Rest
  const sortedCompetitions = [...COMPETITIONS].sort((a, b) => {
    const offA = officialList.includes(a.id) ? 1 : 0;
    const offB = officialList.includes(b.id) ? 1 : 0;
    if (offA !== offB) return offB - offA;

    const countA = votes[a.id] || 0;
    const countB = votes[b.id] || 0;
    return countB - countA;
  });

  return (
    <Container $isAdmin={isAdmin}>
      <Header onClick={() => setIsOpen(!isOpen)} $isAdmin={isAdmin}>
        <Title>
          ⚽️ Wettbewerbs-Voting
          {isAdmin && (
            <span
              style={{
                fontSize: "0.7rem",
                color: "#0070f3",
                marginLeft: "10px",
              }}
            >
              ADMIN-MODUS
            </span>
          )}
        </Title>
        <span style={{ color: "#94a3b8" }}>{isOpen ? "▲" : "▼"}</span>
      </Header>

      <Content $isOpen={isOpen}>
        <p
          style={{
            marginTop: 0,
            marginBottom: "15px",
            color: "#64748b",
            fontSize: "0.85rem",
          }}
        >
          {isAdmin
            ? "Wähle aus, welche Wettbewerbe du in deiner Bar zeigst. Diese erscheinen für Fans als 'Inhaber-bestätigt'."
            : "Bestätige, welche Wettbewerbe hier gezeigt werden."}
        </p>

        <Grid>
          {sortedCompetitions.map((comp) => {
            const count = votes[comp.id] || 0;
            const isOfficial = officialList.includes(comp.id);
            const hasUserVoted = userVotes[comp.id];

            return (
              <VoteButton
                key={comp.id}
                onClick={() =>
                  isAdmin ? handleAdminToggle(comp.id) : handleVote(comp.id)
                }
                disabled={loading === comp.id || (!isAdmin && hasUserVoted)}
                $hasVoted={hasUserVoted}
                $isOfficial={isOfficial}
              >
                <CompName>{comp.name}</CompName>

                <StatusLine>
                  {isAdmin ? (
                    isOfficial ? (
                      <span style={{ color: "#1d4ed8" }}>✅ Aktiviert</span>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>Ausgeschaltet</span>
                    )
                  ) : // FAN ANSICHT
                  isOfficial ? (
                    <span style={{ color: "#1d4ed8" }}>
                      💎 Inhaber-bestätigt
                    </span>
                  ) : hasUserVoted ? (
                    <span style={{ color: "#15803d" }}>
                      ✅ Bestätigt ({count})
                    </span>
                  ) : count > 0 ? (
                    <span style={{ color: "#166534" }}>
                      <b>{count}x</b> bestätigt
                    </span>
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
