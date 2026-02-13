"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

// --- STYLES ---
const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

const Hero = styled.div`
  background: #0f172a;
  color: white;
  padding: 100px 20px;
  text-align: center;
`;

const Tag = styled.span`
  background: #1e293b;
  color: #facc15;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #334155;
`;

const SetupCard = styled.div`
  max-width: 450px;
  margin: -60px auto 80px auto;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const FeatureGrid = styled.div`
  max-width: 1000px;
  margin: 60px auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 20px;
`;

const Feature = styled.div`
  background: white;
  padding: 35px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  h3 {
    margin: 15px 0 10px 0;
    color: #0f172a;
    font-weight: 800;
  }
  p {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .icon {
    font-size: 1.8rem;
    display: block;
  }
`;

export default function OwnerSetupClient() {
  const searchParams = useSearchParams();
  const barId = searchParams.get("barId");
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);

  // ZUSTAND A: EIGENTLICHES SETUP (Link aus E-Mail)
  if (barId && email) {
    return (
      <Container>
        <Hero>
          <h1>Fast am Anstoß! ⚽️</h1>
          <p>Lege dein Passwort fest, um dein Programm zu verwalten.</p>
        </Hero>
        <SetupCard>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
            }}
          >
            <label
              style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8" }}
            >
              ACCOUNT
            </label>
            <input
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 20px 0",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
              value={email}
              disabled
            />
            <label
              style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8" }}
            >
              PASSWORT WÄHLEN
            </label>
            <input
              type="password"
              placeholder="Mind. 8 Zeichen"
              style={{
                width: "100%",
                padding: "14px",
                margin: "8px 0 20px 0",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
              required
            />
            <button
              disabled={loading}
              style={{
                width: "100%",
                background: "#0070f3",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "10px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              {loading ? "Wird aktiviert..." : "Account aktivieren"}
            </button>
          </form>
        </SetupCard>
      </Container>
    );
  }

  // ZUSTAND B: LANDINGPAGE (Allgemeiner Aufruf)
  return (
    <Container>
      <Hero>
        <div style={{ marginBottom: "24px" }}>
          <Tag>Partner-Bereich</Tag>
        </div>
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            letterSpacing: "-1px",
          }}
        >
          Zeig den Fans, welches <br />
          <span style={{ color: "#facc15" }}>Turnier bei dir läuft.</span>
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "700px",
            margin: "24px auto 48px auto",
            color: "#94a3b8",
            lineHeight: "1.6",
          }}
        >
          Verknüpfe deine Bar mit den Wettbewerben, die du zeigst, und werde für
          jedes Derby gefunden.
        </p>
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
          <SearchBar placeholder="Name deiner Bar finden..." />
        </div>
      </Hero>

      <FeatureGrid>
        <Feature>
          <span className="icon">🏆</span>
          <h3>Wettbewerbe wählen</h3>
          <p>
            Markiere mit einem Klick, ob bei dir Bundesliga, Champions League
            oder Regionalliga läuft.
          </p>
        </Feature>
        <Feature>
          <span className="icon">📅</span>
          <h3>Gezielte Spielsuche</h3>
          <p>
            Deine Bar erscheint automatisch in den Filtern, wenn Fans nach
            spezifischen Turnieren suchen.
          </p>
        </Feature>
        <Feature>
          <span className="icon">💎</span>
          <h3>Spezial-Events</h3>
          <p>
            EM, WM oder das Pokalfinale? Verifiziere deine Bar und hebe dich bei
            großen Turnieren ab.
          </p>
        </Feature>
      </FeatureGrid>

      <div
        style={{
          background: "white",
          padding: "80px 20px",
          textAlign: "center",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>
          Dein Programm, deine Gäste.
        </h2>
        <Link
          href="/add?role=owner"
          style={{
            display: "inline-block",
            background: "#0f172a",
            color: "white",
            padding: "18px 36px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "1.1rem",
            marginTop: "20px",
          }}
        >
          ➕ Bar eintragen & Wettbewerbe wählen
        </Link>
      </div>
    </Container>
  );
}
