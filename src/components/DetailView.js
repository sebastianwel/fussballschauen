"use client";

import styled from "styled-components";
import Link from "next/link";
import VerificationButton from "./VerificationButton";
import TeamWidget from "./TeamWidget";
import CompetitionVoting from "./CompetitionVoting";
import BackButton from "./BackButton";
import MatchSchedule from "./MatchSchedule";

// --- STYLES ---
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  display: inline-block;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const Meta = styled.div`
  color: #666;
  display: flex;
  gap: 15px;
  font-size: 0.95rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
`;

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
`;

const OpeningHoursList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
  color: #444;

  li {
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
`;

const UnverifiedBadge = styled.span`
  background: #fffbeb; /* Helles Gelb */
  color: #b45309; /* Dunkles Gelb/Orange */
  border: 1px solid #fcd34d;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

export default function DetailView({ bar }) {
  // --- SMARTE FUNKTION FÜR ÖFFNUNGSZEITEN ---
  const getFormattedHours = (rawData) => {
    if (!rawData) return [];

    // Versuch 1: Ist es JSON (altes Google Format)?
    try {
      // Wenn das Parsen klappt und es ein Array ist -> Google Format
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed; // Gibt z.B. ["Monday: Closed", "Tuesday: 5:00..."] zurück
      }
    } catch (e) {
      // Wenn Fehler: Es war kein JSON, also ignorieren und weiter machen
    }

    // Versuch 2: Es ist normaler Text (Manuelles Format)
    // Wir teilen am Zeilenumbruch (\n)
    return rawData.split("\n").filter((line) => line.trim() !== "");
  };

  const hoursList = getFormattedHours(bar.opening_hours);
  const getSafeUrl = (url) =>
    !url ? "" : url.startsWith("http") ? url : `https://${url}`;

  return (
    <Container>
      <BackButton />
      <Header>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <div>
            <Title>{bar.name}</Title>
            <Meta>
              <span>
                📍 {bar.address ? bar.address : `${bar.zip_code} ${bar.city}`}
              </span>
              {bar.home_team && <Badge>⚽ {bar.home_team}</Badge>}
              {bar.verification_score === 1 && (
                <UnverifiedBadge>Noch nicht verifiziert</UnverifiedBadge>
              )}
            </Meta>
          </div>
        </div>
      </Header>

      {/* GAMIFICATION / FEATURES */}
      <Section>
        <CompetitionVoting bar={bar} />
      </Section>

      <section>
        <MatchSchedule bar={bar} matches={bar.upcomingMatches} />
      </section>
      {/*Home Team Selection */}
      <Section>
        <TeamWidget bar={bar} />
      </Section>

      {/* ÖFFNUNGSZEITEN */}
      {hoursList.length > 0 && (
        <Section>
          <SectionTitle>🕒 Öffnungszeiten</SectionTitle>
          <Card>
            <OpeningHoursList>
              {hoursList.map((line, i) => {
                // Optional: Wir versuchen, den Tag fett zu machen, wenn ein Doppelpunkt da ist
                const parts = line.split(": ");
                if (parts.length > 1) {
                  return (
                    <li key={i}>
                      <strong>{parts[0]}</strong>
                      <span>{parts.slice(1).join(": ")}</span>
                    </li>
                  );
                }
                return <li key={i}>{line}</li>;
              })}
            </OpeningHoursList>
          </Card>
        </Section>
      )}

      {/* KONTAKT */}
      <Section>
        <SectionTitle>📞 Kontakt</SectionTitle>
        <Card>
          {bar.contact_info.website && (
            <div style={{ marginBottom: 8 }}>
              🌐{" "}
              <a
                href={getSafeUrl(bar.contact_info.website)}
                target="_blank"
                style={{ color: "#0070f3" }}
              >
                Webseite besuchen
              </a>
            </div>
          )}
          {bar.contact_info.phone && (
            <div style={{ marginBottom: 8 }}>
              📞{" "}
              <a
                href={`tel:${bar.contact_info.phone}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                {bar.contact_info.phone}
              </a>
            </div>
          )}
          {!bar.contact_info.website && !bar.contact_info.phone && (
            <div style={{ color: "#999" }}>Keine Kontaktdaten hinterlegt.</div>
          )}
        </Card>
      </Section>
    </Container>
  );
}
