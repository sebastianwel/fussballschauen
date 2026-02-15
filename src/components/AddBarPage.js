"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { addBar } from "@/actions/addBar";
import { TEAMS, COMPETITIONS } from "@/lib/constants";

// --- STYLES ---
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

const OwnerCheckboxWrapper = styled.div`
  margin-top: 10px;
  padding: 18px;
  background: ${(props) => (props.$active ? "#eff6ff" : "#f8fafc")};
  border: 2px solid ${(props) => (props.$active ? "#0070f3" : "#e2e8f0")};
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    accent-color: #0070f3;
  }
  &:hover {
    border-color: #0070f3;
  }
`;

const OwnerText = styled.div`
  strong {
    display: block;
    font-size: 0.95rem;
    color: #0f172a;
    margin-bottom: 2px;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
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
  margin-top: 10px;
  transition: background 0.2s;
  &:hover {
    background: #005bb5;
  }
  &:disabled {
    background: #ccc;
    cursor: wait;
  }
`;

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
    bottom: 125%;
    left: 50%;
    margin-left: -110px;
    opacity: 0;
    transition: opacity 0.3s;
    font-size: 0.8rem;
    pointer-events: none;
  }
  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

// --- KOMPONENTE ---

export default function AddBarClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Parameter auslesen
  const isOwnerMode = searchParams.get("role") === "owner";
  const prefilledCity = searchParams.get("prefill_city") || "";

  // Lokaler State für Checkbox
  const [manualOwner, setManualOwner] = useState(isOwnerMode);

  // Sync bei Mount
  useEffect(() => {
    if (isOwnerMode) setManualOwner(true);
  }, [isOwnerMode]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const result = await addBar(formData);

    if (result.success) {
      const finalIsOwner = isOwnerMode || manualOwner;
      const targetPath = finalIsOwner
        ? `/bar/${result.slug}#owner`
        : `/bar/${result.slug}`;
      router.push(targetPath);
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
        <Link
          href={manualOwner || isOwnerMode ? "/owner-setup" : "/"}
          style={{ color: "#666", textDecoration: "none" }}
        >
          ← Zurück{" "}
          {manualOwner || isOwnerMode ? "zum Inhaber-Portal" : "zur Startseite"}
        </Link>
      </div>

      <Container>
        <Title>
          {manualOwner ? "Bar registrieren 🛡️" : "Bar hinzufügen 🍻"}
        </Title>
        <Subtitle>
          {manualOwner
            ? "Trage hier deine Basisdaten ein. Im nächsten Schritt verifizieren wir dich als Inhaber."
            : "Kennst du eine Kneipe, die hier fehlt? Trag sie ein!"}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
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
              <Input
                name="city"
                placeholder="Hamburg"
                defaultValue={prefilledCity}
                required
              />
            </div>
          </div>

          <div style={{ borderTop: "1px solid #eee", margin: "10px 0" }}></div>

          <div>
            <Label style={{ display: "flex", alignItems: "center" }}>
              Öffnungszeiten
              <TooltipWrapper>
                <span className="icon">ℹ️</span>
                <span className="tooltip-text">
                  Tipp: Einfach aus Google Maps kopieren.
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

          <div>
            <Label>Hausmannschaft</Label>
            <Select name="home_team" defaultValue="">
              <option value="">– Keine spezielle Mannschaft –</option>
              {[
                "bundesliga",
                "2bundesliga",
                "3liga",
                "premier-league",
                "la-liga",
              ].map((league) => (
                <optgroup key={league} label={league.toUpperCase()}>
                  {getTeamsByLeague(league).map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </Select>
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
            </GridContainer>
          </div>

          <OwnerCheckboxWrapper
            $active={manualOwner}
            onClick={() => setManualOwner(!manualOwner)}
          >
            <input type="checkbox" checked={manualOwner} readOnly />
            <OwnerText>
              <strong>Ich bin der Inhaber / Betreiber</strong>
              <p>Aktiviere dies, um dein Profil direkt zu verifizieren.</p>
            </OwnerText>
          </OwnerCheckboxWrapper>

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? "Speichere..."
              : manualOwner
                ? "Bar erstellen & Inhaber-Setup starten"
                : "Bar eintragen"}
          </SubmitButton>
        </Form>
      </Container>
    </div>
  );
}
