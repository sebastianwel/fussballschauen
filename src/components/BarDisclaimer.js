"use client";

import styled from "styled-components";

const DisclaimerBox = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const Text = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;

  strong {
    color: #1e293b;
  }
`;

export function BarDisclaimer() {
  return (
    <div style={{ padding: "0 20px" }}>
      <DisclaimerBox>
        <span style={{ fontSize: "1.2rem", marginTop: "-2px" }}>⚠️</span>
        <Text>
          <strong>Hinweis zur Aktualität:</strong> Alle Angaben zu
          Übertragungen, Lizenzen und Öffnungszeiten erfolgen
          <strong> ohne Gewähr</strong>. Diese Informationen werden von der
          Community und Betreibern gepflegt. Da sich kurzfristige
          Programmänderungen oder Lizenzwechsel ergeben können, empfehlen wir,
          vorab auf die <strong>jüngsten Community-Bestätigungen</strong> zu
          achten oder im Zweifel kurz bei der Location anzurufen.
        </Text>
      </DisclaimerBox>
    </div>
  );
}
