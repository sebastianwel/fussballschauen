"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { sendClaimCode } from "@/actions/sendClaimCode";
import { verifyClaimCode } from "@/actions/verifyClaimCode";
import Link from "next/link";

// --- STYLES ---

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2.5rem;
`;

const WidgetCard = styled.div`
  background: ${(props) =>
    props.$success
      ? "#f0fdf4"
      : "linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%)"};
  border: 1px solid ${(props) => (props.$success ? "#86efac" : "#e1e4e8")};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Label = styled.div`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background: white;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1a1a1a;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: 2px solid #0070f3;
  font-size: 1.8rem;
  text-align: center;
  letter-spacing: 8px;
  margin-bottom: 12px;
  font-weight: 800;
  background: white;
  color: #1a1a1a;
`;

const MainButton = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none; /* Wichtig für as="a" */

  &:hover {
    background: #0061d1;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

const CompactFallbackButton = styled.a`
  display: inline-block;
  background: white;
  color: #475569;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 10px;
  transition: all 0.2s;
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const FallbackArea = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px dashed #e2e8f0;
`;

// --- KOMPONENTE ---

export default function ClaimWidget({ bar }) {
  const [step, setStep] = useState(1);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bar?.emails?.length > 0) setSelectedEmail(bar.emails[0]);
  }, [bar]);

  const maskEmail = (email) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    return `${name.substring(0, 2)}***${name.slice(-1)}@${domain}`;
  };

  const emailSubject = encodeURIComponent(`Inhaber-Verifizierung: ${bar.name}`);
  const emailBody = encodeURIComponent(
    `Hallo Team von Wo läuft Fußball,\n\n` +
      `ich bin der Betreiber der Bar "${bar.name}" und möchte gerne meinen Eintrag verifizieren lassen, um mein Programm und meine Daten selbst zu verwalten.\n\n` +
      `Details zur Bar:\n` +
      `- Name: ${bar.name}\n` +
      `- Adresse: ${bar.address || bar.city}\n` +
      `- Bar-ID: ${bar.id}\n\n` +
      `Bitte gebt mir kurz Bescheid, welche Nachweise ihr benötigt oder schaltet meinen Account direkt frei.\n\n` +
      `Beste Grüße,\n` +
      `[Dein Name / Stempel der Bar]`,
  );

  const mailtoUrl = `mailto:hallo@wolaeuftfussball.de?subject=${emailSubject}&body=${emailBody}`;

  const requestMail = async () => {
    setLoading(true);
    const result = await sendClaimCode(bar.id, selectedEmail);
    if (result.success) {
      setStep(2);
    } else {
      alert("Fehler: " + result.error);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    const result = await verifyClaimCode(bar.id, code, selectedEmail);
    if (result.success) {
      setStep(3);
    } else {
      alert(result.error || "Code falsch oder abgelaufen.");
    }
    setLoading(false);
  };

  if (bar.is_claimed) return null;

  return (
    <div id="owner">
      <SectionTitle>
        <span>🛡️</span> Für Gastronomen
      </SectionTitle>

      <WidgetCard $success={step === 3}>
        <Label>Eintrag verifizieren</Label>

        {step === 1 && (
          <>
            {/* Gemeinsamer Info-Text für beide Zustände */}
            <InfoText>
              {bar.emails?.length > 0
                ? "Sichere dir den Inhaber-Status. Wir senden einen Code an deine hinterlegte Adresse:"
                : "Für diese Bar ist aktuell keine E-Mail hinterlegt. Bitte stelle eine manuelle Anfrage zur Verifizierung."}
            </InfoText>

            {bar.emails?.length > 0 ? (
              <>
                <Select
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                >
                  {bar.emails.map((e) => (
                    <option key={e} value={e}>
                      {maskEmail(e)}
                    </option>
                  ))}
                </Select>
                <MainButton onClick={requestMail} disabled={loading}>
                  {loading ? "Wird gesendet..." : "Bestätigungscode anfordern"}
                </MainButton>

                <FallbackArea>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    E-Mail veraltet oder falsch?
                  </p>
                  <CompactFallbackButton href={mailtoUrl}>
                    Manuelle Anfrage stellen
                  </CompactFallbackButton>
                </FallbackArea>
              </>
            ) : (
              <MainButton as="a" href={mailtoUrl}>
                Zugang manuell anfragen
              </MainButton>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <InfoText>
              Prüfe dein Postfach (<strong>{maskEmail(selectedEmail)}</strong>):
            </InfoText>
            <Input
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
            />
            <MainButton
              onClick={handleVerify}
              disabled={loading || code.length < 6}
            >
              {loading ? "Prüfe..." : "Bar jetzt freischalten"}
            </MainButton>
            <p
              onClick={() => setStep(1)}
              style={{
                fontSize: "0.8rem",
                color: "#0070f3",
                marginTop: "15px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Abbrechen & Zurück
            </p>
          </>
        )}

        {step === 3 && (
          <div style={{ padding: "10px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>✅</div>
            <h3 style={{ color: "#166534", margin: "0 0 5px 0" }}>
              Verifiziert!
            </h3>
            <p
              style={{
                color: "#166534",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Deine Bar ist nun offiziell markiert.
              <br />
              <Link
                href={`/owner-setup?barId=${bar.id}&email=${selectedEmail}`}
                style={{
                  color: "#166534",
                  textDecoration: "underline",
                  marginTop: "10px",
                  display: "inline-block",
                }}
              >
                Jetzt Profil-Passwort festlegen →
              </Link>
            </p>
          </div>
        )}
      </WidgetCard>
    </div>
  );
}
