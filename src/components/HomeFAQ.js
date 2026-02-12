"use client";

import { useState } from "react";
import styled from "styled-components";

const Section = styled.section`
  max-width: 800px;
  margin: 80px auto;
  padding: 0 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 40px;
  color: #0f172a;
  letter-spacing: -0.5px;
`;

const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const Question = styled.button`
  width: 100%;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;

  span.icon {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
    color: #94a3b8;
  }
`;

const Answer = styled.div`
  padding: ${(props) => (props.$isOpen ? "0 24px 20px 24px" : "0 24px")};
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #475569;
  line-height: 1.6;
  font-size: 0.95rem;
`;

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "Läuft das Spiel da dann wirklich?",
      a: "Hand aufs Herz: Eine 100%ige Garantie gibt es im Fußball (und bei uns) nicht. Die Infos kommen entweder direkt vom Wirt oder von Fans aus der Community. Wenn du sichergehen willst: Achte auf das 'Verifiziert'-Häkchen – da hat der Inhaber das Programm höchstpersönlich bestätigt.",
    },
    {
      q: "Was, wenn ich vor einer dunklen Leinwand stehe?",
      a: "Richtig nervig, kennen wir. Wenn eine Info mal nicht stimmt, klick bitte sofort auf 'Fehler melden'. Damit rettest du dem nächsten Fan den Nachmittag und wir können die Daten direkt korrigieren. Nur so funktioniert der Laden.",
    },
    {
      q: "Woher kommen die ganzen Kneipen-Infos?",
      a: "Das ist Teamwork. Ein Teil der Wirte pflegt das Programm selbst ein, den Rest erledigen engagierte Fans. Wenn deine Stammkneipe noch fehlt oder die Infos alt sind: Du kannst jede Bar selbst bearbeiten oder neu hinzufügen.",
    },
    {
      q: "Kostet mich die Nutzung was?",
      a: "Keinen Cent. wolaeuftfussball.de ist ein Projekt von Fans für Fans. Wir wollen einfach nur, dass niemand mehr das Derby verpasst, nur weil er in der falschen Kneipe gelandet ist.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section>
      <Title>Häufig gefragt</Title>
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
          fontStyle: "italic",
        }}
      >
        * Wir übernehmen keine Haftung für verpasste Tore oder falsch gezapftes
        Bier. Die Übertragungsrechte liegen bei den jeweiligen Gastronomen.
      </p>
    </Section>
  );
}
