"use client";

import { useState } from "react";
import styled from "styled-components";

const Section = styled.section`
  max-width: 800px;
  margin: 100px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 50px;
  color: #0f172a;
`;

const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const Question = styled.button`
  width: 100%;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;

  span.icon {
    transition: transform 0.3s ease;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
    color: #64748b;
  }
`;

const Answer = styled.div`
  padding: ${(props) => (props.$isOpen ? "0 24px 20px 24px" : "0 24px")};
  max-height: ${(props) =>
    props.$isOpen ? "400px" : "0"}; // Erhöht für längere Texte
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
`;

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Sind die Angaben zu den Spielen garantiert?",
      a: "Nein, alle Angaben erfolgen ohne Gewähr. Fussballschauen.de ist eine Community-Plattform. Die Informationen basieren auf den Angaben der Bar-Betreiber und werden durch das Feedback der Fans vor Ort verfeinert. Wir empfehlen im Zweifel immer einen kurzen Blick auf die aktuellen Community-Bestätigungen in der App.",
    },
    {
      q: "Was mache ich, wenn eine Info falsch ist?",
      a: "Das ist der Kern unserer Seite! Wenn du siehst, dass ein Spiel doch nicht läuft, nutze einfach den 'Fehler melden' Button in der Detailansicht. So hilfst du anderen Fans, nicht vor verschlossener Tür zu landen.",
    },
    {
      q: "Wer pflegt die Daten der Bars ein?",
      a: "Die Profile werden teils von den Bar-Besitzern selbst und teils von engagierten Fans gepflegt. Da sich Lizenzen und Öffnungszeiten ändern können, lebt die Seite vom Mitmachen der Community.",
    },
    {
      q: "Ist die Nutzung für mich kostenlos?",
      a: "Ja, die Suche und das Mitwirken in der Community sind komplett kostenlos. Unser Ziel ist es lediglich, die Suche nach dem nächsten Fußballabend für alle einfacher zu machen.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section>
      <Title>Häufig gestellte Fragen</Title>
      <Accordion>
        {faqs.map((faq, i) => (
          <Item key={i}>
            <Question $isOpen={openIndex === i} onClick={() => toggle(i)}>
              {faq.q}
              <span className="icon">▼</span>
            </Question>
            <Answer $isOpen={openIndex === i}>{faq.a}</Answer>
          </Item>
        ))}
      </Accordion>
      <p
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "0.8rem",
          color: "#94a3b8",
        }}
      >
        * Alle Angaben ohne Gewähr. Die Verfügbarkeit von Übertragungen hängt
        von den individuellen Lizenzen der Gastronomen ab.
      </p>
    </Section>
  );
}
