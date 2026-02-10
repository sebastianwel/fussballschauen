"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addBar } from "@/actions/addBar";
import { TEAMS, COMPETITIONS } from "@/lib/constants";

// ... (Andere Styles bleiben gleich, Container, Form, Title, etc.)
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;
const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Title = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  color: #1a1a1a;
`;
const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;
const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 8px;
  display: block;
`;
const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  background: white;
  cursor: pointer;
  appearance: none;
  &:focus {
    border-color: #0070f3;
  }
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 5px;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: #f9f9f9;
  padding: 12px 15px;
  border-radius: 12px;
  border: 1px solid #eee;
  font-size: 0.9rem;
  transition: background 0.2s;
  &:hover {
    background: #f0f0f0;
  }
  input {
    width: 18px;
    height: 18px;
    accent-color: #0070f3;
  }
`;
const SubmitButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s;
  &:hover {
    background: #005bb5;
  }
  &:disabled {
    background: #ccc;
    cursor: wait;
  }
`;

// NEU: TextArea für Öffnungszeiten
const TextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  font-family: inherit;
  resize: vertical;
  &:focus {
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
`;

// NEU: Tooltip Styles
const TooltipWrapper = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 8px;
  cursor: help;

  .icon {
    font-size: 1.1rem;
  }

  .tooltip-text {
    visibility: hidden;
    width: 220px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position über dem Icon */
    left: 50%;
    margin-left: -110px; /* Zentrieren */
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.8rem;
    font-weight: normal;
    pointer-events: none;

    /* Kleiner Pfeil nach unten */
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

export default function AddBarPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const result = await addBar(formData);

    if (result.success) {
      alert("Danke! Die Bar wurde eingetragen.");
      router.push(`/bar/${result.slug}`);
    } else {
      alert("Fehler: " + result.message);
      setLoading(false);
    }
  }

  const getTeamsByLeague = (leagueId) =>
    TEAMS.filter((t) => t.league === leagueId).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Link href="/" style={{ color: "#666", textDecoration: "none" }}>
          ← Zurück zur Startseite
        </Link>
      </div>

      <Container>
        <Title>Bar hinzufügen 🍻</Title>
        <Subtitle>
          Kennst du eine Kneipe, die hier fehlt?
          <br />
          Trag sie ein (kostenlos & ohne Login)!
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          {/* Basis Infos */}
          <div>
            <Label>Name der Bar</Label>
            <Input
              name="name"
              placeholder="z.B. Zum Goldenen Handschuh"
              required
            />
          </div>

          <div>
            <Label>Straße & Hausnummer</Label>
            <Input name="street" placeholder="z.B. Reeperbahn 12" required />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <Label>PLZ</Label>
              <Input name="zip" placeholder="20359" required />
            </div>
            <div style={{ flex: 2 }}>
              <Label>Stadt</Label>
              <Input name="city" placeholder="Hamburg" required />
            </div>
          </div>

          {/* --- NEU: KONTAKT & ÖFFNUNGSZEITEN --- */}
          <div style={{ borderTop: "1px solid #eee", margin: "10px 0" }}></div>

          <div>
            <Label style={{ display: "flex", alignItems: "center" }}>
              Öffnungszeiten
              <TooltipWrapper>
                <span className="icon">ℹ️</span>
                <span className="tooltip-text">
                  Tipp: Einfach aus Google Maps kopieren und hier einfügen.
                </span>
              </TooltipWrapper>
            </Label>
            <TextArea
              name="opening_hours"
              rows="5"
              placeholder={`Montag: 17:00–01:00\nDienstag: 17:00–01:00\n...`}
            />
          </div>

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <Label>Webseite (optional)</Label>
              <Input name="website" placeholder="www.bar.de" />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Telefon (optional)</Label>
              <Input name="phone" placeholder="040 123456" />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eee", margin: "10px 0" }}></div>
          {/* --- ENDE NEU --- */}

          <div>
            <Label>Hausmannschaft</Label>
            <div style={{ position: "relative" }}>
              <Select name="home_team" defaultValue="">
                <option value="">– Keine spezielle Mannschaft –</option>
                <optgroup label="1. Bundesliga">
                  {getTeamsByLeague("bundesliga").map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="2. Bundesliga">
                  {getTeamsByLeague("bundesliga2").map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="3. Liga">
                  {getTeamsByLeague("liga3").map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              </Select>
              <div
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                }}
              >
                ▼
              </div>
            </div>
          </div>

          <div>
            <Label>Wettbewerbe</Label>
            <GridContainer>
              {COMPETITIONS.map((comp) => (
                <CheckboxLabel key={comp.id}>
                  <input type="checkbox" name={comp.id} />
                  {comp.name}
                </CheckboxLabel>
              ))}
              <CheckboxLabel>
                <input type="checkbox" name="free_tv_general" />
                Allgemeines Free-TV
              </CheckboxLabel>
            </GridContainer>
          </div>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Speichere..." : "Bar eintragen"}
          </SubmitButton>
        </Form>
      </Container>
    </div>
  );
}
