"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { voteMatch } from "@/actions/voteMatch";
// Falls du die Action schon angelegt hast, hier importieren:
import { toggleMatchStatus } from "@/actions/toggleMatchStatus";
import { useRouter } from "next/navigation";

// --- STYLES (Deine Original-Styles + Admin Erweiterungen) ---
const Container = styled.div`
  margin-top: 20px;
`;

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin: 0;
  color: #1a1a1a;
`;

const SubText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 4px 0 0 0;
`;

const DateGroup = styled.div`
  margin-bottom: 2.5rem;
`;

const DateHeader = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MatchList = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 16px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const MatchCard = styled.div`
  width: 85vw;
  max-width: 300px;
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition:
    transform 0.2s,
    opacity 0.2s;

  border: 1px solid
    ${(props) => {
      if (props.$status === "owner") return " #86efac"; // Gold Border für Inhaber
      if (props.$status === "home" || props.$status === "confirmed")
        return "#86efac";
      return "#e2e8f0";
    }};

  background: ${(props) => {
    if (props.$status === "owner") return "#d2f2db";
    if (props.$status === "home") return "#f0fdf4";
    return "white";
  }};
`;

const TopStatusBadge = styled.div`
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 8px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: inline-block;
  align-self: flex-start;

  background: ${(props) => {
    if (props.$type === "owner") return "#86efac"; // Gold-Badge
    if (props.$type === "home" || props.$type === "confirmed") return "#dcfce7";
    return "#f1f5f9";
  }};

  color: ${(props) => {
    if (props.$type === "owner") return "#166534";
    if (props.$type === "home" || props.$type === "confirmed") return "#166534";
    return "#64748b";
  }};
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
`;

const Teams = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 15px;
  line-height: 1.3;
  flex-grow: 1;

  span.vs {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 400;
    margin: 0 6px;
  }
`;

const InfoText = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${(props) => (props.$isWarning ? "#94a3b8" : "#15803d")};
`;

const VoteArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  width: 100%;
`;

const ConfirmButton = styled.button`
  background: ${(props) => (props.$hasVoted ? "#dcfce7" : "transparent")};
  color: ${(props) => (props.$hasVoted ? "#166534" : "#0f172a")};
  border: 1px solid ${(props) => (props.$hasVoted ? "#86efac" : "#cbd5e1")};
  width: 100%;
  padding: 10px 12px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: ${(props) => (props.$hasVoted ? "default" : "pointer")};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$hasVoted ? "#dcfce7" : "#f8fafc")};
  }
`;

// Spezieller Admin-Button
const AdminActionButton = styled(ConfirmButton)`
  background: ${(props) => (props.$isConfirmed ? "#ef4444" : "#22c55e")};
  color: white;
  border: none;
  &:hover {
    background: ${(props) => (props.$isConfirmed ? "#dc2626" : "#16a34a")};
  }
`;

const ReportLink = styled.button`
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 0.7rem;
  cursor: pointer;
  padding: 4px 8px;
  text-align: center;
  width: 100%;
  transition: color 0.2s;

  &:hover {
    color: #94a3b8;
  }
`;

const UserReportedBox = styled.div`
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
`;

const UndoLink = styled.button`
  background: transparent;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  font-size: 0.75rem;
`;

// --- HELPER ---
const isSameTeam = (barTeam, matchTeam) => {
  if (!barTeam || !matchTeam) return false;
  const b = barTeam.toLowerCase().trim();
  const m = matchTeam.toLowerCase().trim();
  return b.includes(m) || m.includes(b);
};

const getDayLabel = (dateString) => {
  const d = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isToday = d.toDateString() === today.toDateString();
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const options = { weekday: "long", day: "2-digit", month: "2-digit" };
  const formatted = d.toLocaleDateString("de-DE", options);
  if (isToday) return `Heute, ${formatted}`;
  if (isTomorrow) return `Morgen, ${formatted}`;
  return formatted;
};

// --- KOMPONENTE ---
export default function MatchSchedule({ bar, matches, isAdmin }) {
  const router = useRouter();
  const [localUpvotes, setLocalUpvotes] = useState({});
  const [localDownvotes, setLocalDownvotes] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const up = {};
    const down = {};
    matches?.forEach((m) => {
      up[m.id] = m.bar_upvotes || 0;
      down[m.id] = m.bar_downvotes || 0;
    });
    setLocalUpvotes(up);
    setLocalDownvotes(down);
    const stored = localStorage.getItem(`match_votes_v3_${bar.id}`);
    if (stored) setUserVotes(JSON.parse(stored));
  }, [matches, bar.id]);

  // Admin-Logik für Bestätigung
  const handleAdminToggle = async (matchId, currentStatus) => {
    setLoading(matchId);
    try {
      const result = await toggleMatchStatus(bar.id, matchId, !currentStatus);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(null);
    }
  };

  const handleAction = async (matchId, actionType) => {
    if (loading === matchId) return;
    const currentVote = userVotes[matchId];

    if (actionType === "reset") {
      const newVotes = { ...userVotes };
      delete newVotes[matchId];
      setUserVotes(newVotes);
      localStorage.setItem(
        `match_votes_v3_${bar.id}`,
        JSON.stringify(newVotes),
      );
      if (currentVote === "down") {
        setLocalDownvotes((prev) => ({
          ...prev,
          [matchId]: Math.max(0, (prev[matchId] || 1) - 1),
        }));
      } else if (currentVote === "up") {
        setLocalUpvotes((prev) => ({
          ...prev,
          [matchId]: Math.max(0, (prev[matchId] || 1) - 1),
        }));
      }
    } else {
      if (currentVote === actionType) return;
      setLoading(matchId);
      const newVotes = { ...userVotes, [matchId]: actionType };
      setUserVotes(newVotes);
      localStorage.setItem(
        `match_votes_v3_${bar.id}`,
        JSON.stringify(newVotes),
      );

      if (actionType === "up") {
        setLocalUpvotes((prev) => ({
          ...prev,
          [matchId]: (prev[matchId] || 0) + 1,
        }));
        if (currentVote === "down")
          setLocalDownvotes((prev) => ({
            ...prev,
            [matchId]: Math.max(0, (prev[matchId] || 1) - 1),
          }));
      } else if (actionType === "down") {
        setLocalDownvotes((prev) => ({
          ...prev,
          [matchId]: (prev[matchId] || 0) + 1,
        }));
        if (currentVote === "up")
          setLocalUpvotes((prev) => ({
            ...prev,
            [matchId]: Math.max(0, (prev[matchId] || 1) - 1),
          }));
      }
    }

    try {
      await voteMatch(bar.id, matchId, actionType, currentVote);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const groupedMatches = {};
  matches.forEach((match) => {
    const date = new Date(match.start_time);
    date.setHours(date.getHours() - 1);
    const dateKey = date.toISOString().split("T")[0];
    match.fixed_start_time = date;
    if (!groupedMatches[dateKey]) groupedMatches[dateKey] = [];
    groupedMatches[dateKey].push(match);
  });

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>📺 Programm-Vorschau</SectionTitle>
        <SubText>
          {isAdmin
            ? "Du verwaltest dieses Programm. Bestätigte Spiele erhalten das Inhaber-Siegel."
            : "Diese Spiele werden voraussichtlich gezeigt. Achte auf das ✅ Siegel für Bestätigungen."}
        </SubText>
      </SectionHeader>

      {(!matches || matches.length === 0) && (
        <SubText
          style={{ marginTop: "20px", color: "#94a3b8", fontStyle: "italic" }}
        >
          Keine Spiele in der Vorschau.
        </SubText>
      )}

      {sortedDates.map((dateKey) => {
        const dayMatches = groupedMatches[dateKey];

        dayMatches.sort((a, b) => {
          const isHomeA =
            bar.home_team &&
            (isSameTeam(bar.home_team, a.home_team) ||
              isSameTeam(bar.home_team, a.away_team));
          const isHomeB =
            bar.home_team &&
            (isSameTeam(bar.home_team, b.home_team) ||
              isSameTeam(bar.home_team, b.away_team));

          const isOwnerA = a.is_confirmed_by_owner;
          const isOwnerB = b.is_confirmed_by_owner;

          const upA = localUpvotes[a.id] || 0;
          const upB = localUpvotes[b.id] || 0;

          // SORTIER-HIERARCHIE:
          // 1. Stammteam
          if (isHomeA && !isHomeB) return -1;
          if (!isHomeA && isHomeB) return 1;

          // 2. Inhaber-bestätigt (NEU)
          if (isOwnerA && !isOwnerB) return -1;
          if (!isOwnerA && isOwnerB) return 1;

          // 3. User-bestätigt
          if (upA > upB) return -1;
          if (upA < upB) return 1;

          return a.fixed_start_time - b.fixed_start_time;
        });

        return (
          <DateGroup key={dateKey}>
            <DateHeader>
              📅 {getDayLabel(dayMatches[0].fixed_start_time)}
            </DateHeader>
            <MatchList>
              {dayMatches.map((match) => {
                const isHomeMatch =
                  bar.home_team &&
                  (isSameTeam(bar.home_team, match.home_team) ||
                    isSameTeam(bar.home_team, match.away_team));
                const isOwnerConfirmed = match.is_confirmed_by_owner;
                const upvotes = localUpvotes[match.id] || 0;
                const downvotes = localDownvotes[match.id] || 0;
                const myVote = userVotes[match.id];

                let cardStatus = "neutral";
                let badgeType = "neutral";
                let badgeText = "📅 GEPLANT";

                if (isOwnerConfirmed) {
                  cardStatus = "owner";
                  badgeType = "owner";
                  badgeText = "💎 INHABER-BESTÄTIGT";
                } else if (isHomeMatch) {
                  cardStatus = "home";
                  badgeType = "home";
                  badgeText = "🏠 STAMMTEAM";
                } else if (upvotes > 0 && upvotes >= downvotes) {
                  cardStatus = "confirmed";
                  badgeType = "confirmed";
                  badgeText = "✅ BESTÄTIGT";
                }

                return (
                  <MatchCard key={match.id} $status={cardStatus}>
                    <TopStatusBadge $type={badgeType}>
                      {badgeText}
                    </TopStatusBadge>
                    <MatchHeader>
                      <span>
                        {match.fixed_start_time.toLocaleTimeString("de-DE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        Uhr
                      </span>
                    </MatchHeader>
                    <Teams>
                      {match.home_team} <span className="vs">vs.</span>{" "}
                      {match.away_team}
                    </Teams>

                    {!isOwnerConfirmed &&
                      upvotes > 0 &&
                      myVote !== "up" &&
                      !isHomeMatch && (
                        <InfoText>
                          👍 {upvotes}{" "}
                          {upvotes === 1 ? "Bestätigung" : "Bestätigungen"}
                        </InfoText>
                      )}
                    {downvotes > 0 && myVote !== "down" && (
                      <InfoText $isWarning>
                        ℹ️ {downvotes} Zweifel gemeldet
                      </InfoText>
                    )}

                    <VoteArea>
                      {isAdmin ? (
                        <AdminActionButton
                          $isConfirmed={isOwnerConfirmed}
                          disabled={loading === match.id}
                          onClick={() =>
                            handleAdminToggle(match.id, isOwnerConfirmed)
                          }
                        >
                          {loading === match.id
                            ? "..."
                            : isOwnerConfirmed
                              ? "Bestätigung aufheben"
                              : "✨ Offiziell bestätigen"}
                        </AdminActionButton>
                      ) : myVote === "down" ? (
                        <UserReportedBox>
                          Meldung eingegangen. <br />
                          <UndoLink
                            onClick={() => handleAction(match.id, "reset")}
                          >
                            Rückgängig
                          </UndoLink>
                        </UserReportedBox>
                      ) : (
                        <>
                          {!isHomeMatch && !isOwnerConfirmed && (
                            <ConfirmButton
                              onClick={() => handleAction(match.id, "up")}
                              $hasVoted={myVote === "up"}
                            >
                              {myVote === "up"
                                ? "✅ Bestätigt"
                                : "👍 Spiel läuft?"}
                            </ConfirmButton>
                          )}
                          <ReportLink
                            onClick={() => handleAction(match.id, "down")}
                          >
                            Fehler melden
                          </ReportLink>
                        </>
                      )}
                    </VoteArea>
                  </MatchCard>
                );
              })}
            </MatchList>
          </DateGroup>
        );
      })}
    </Container>
  );
}
