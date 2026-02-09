"use client";

import styled from "styled-components";
import Link from "next/link";
import VerificationButton from "./VerificationButton";
import TeamWidget from "./TeamWidget";

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
`;

const Badge = styled.span`
  background: ${(props) =>
    props.$status === "OPERATIONAL" ? "#e6f4ea" : "#fce8e6"};
  color: ${(props) =>
    props.$status === "OPERATIONAL" ? "#1e7e34" : "#c5221f"};
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const OpeningHours = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  li {
    margin-bottom: 6px;
  }
`;

export default function DetailView({ bar }) {
  // Google Daten holen (falls vorhanden)
  const gMeta = bar.google_meta || {};
  const contact = bar.contact_info || {};
  const status = gMeta.status || "UNKNOWN";

  return (
    <Container>
      <BackLink href="/">← Zurück zur Übersicht</BackLink>

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
                📍 {bar.address}, {bar.zip_code} {bar.city}
              </span>
              <Badge $status={status}>
                {status === "OPERATIONAL" ? "Geöffnet" : "Geschlossen"}
              </Badge>
            </Meta>
            {gMeta.rating && (
              <div
                style={{ marginTop: 10, color: "#f59e0b", fontWeight: "bold" }}
              >
                ★ {gMeta.rating}{" "}
                <span style={{ color: "#999", fontWeight: "normal" }}>
                  ({gMeta.reviews} Reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </Header>

      {/* DER GAMIFICATION BEREICH */}
      <Section>
        <SectionTitle>
          📡 Wer überträgt was?
          <span
            style={{ fontSize: "0.8rem", fontWeight: "normal", color: "#666" }}
          >
            Hilf der Community & sammle XP!
          </span>
        </SectionTitle>
        <Grid>
          {/* Hier rufen wir unsere Smart Buttons auf */}
          <Card>
            <div
              style={{ marginBottom: 10, fontWeight: "bold", color: "#0072bc" }}
            >
              Sky / WOW
            </div>
            <VerificationButton
              barId={bar.id}
              feature="sky"
              label="Gibt's Sky?"
              icon="📺"
            />
          </Card>

          <Card>
            <div
              style={{ marginBottom: 10, fontWeight: "bold", color: "#1d1d1d" }}
            >
              DAZN
            </div>
            <VerificationButton
              barId={bar.id}
              feature="dazn"
              label="Gibt's DAZN?"
              icon="⚽"
            />
          </Card>

          <Card>
            <div
              style={{ marginBottom: 10, fontWeight: "bold", color: "#28a745" }}
            >
              Free-TV
            </div>
            <VerificationButton
              barId={bar.id}
              feature="free_tv"
              label="ARD/ZDF?"
              icon="📡"
            />
          </Card>
        </Grid>
      </Section>

      {/* ÖFFNUNGSZEITEN */}
      {bar.opening_hours && (
        <Section>
          <SectionTitle>🕒 Öffnungszeiten</SectionTitle>
          <Card>
            <OpeningHours>
              {bar.opening_hours.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </OpeningHours>
          </Card>
        </Section>
      )}

      {/* KONTAKT */}
      <Section>
        <SectionTitle>📞 Kontakt</SectionTitle>
        <Card>
          {contact.website && (
            <div style={{ marginBottom: 8 }}>
              🌐{" "}
              <a
                href={contact.website}
                target="_blank"
                style={{ color: "#0070f3" }}
              >
                Webseite besuchen
              </a>
            </div>
          )}
          {contact.phone && <div>📞 {contact.phone}</div>}
          {!contact.website && !contact.phone && (
            <div style={{ color: "#999" }}>Keine Kontaktdaten hinterlegt.</div>
          )}
        </Card>
        <TeamWidget barId={bar.id} initialTeam={bar.home_team} />
      </Section>
    </Container>
  );
}
