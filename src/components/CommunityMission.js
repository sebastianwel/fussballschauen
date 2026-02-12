"use client";
import styled from "styled-components";

const Section = styled.section`
  padding: 80px 20px;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 800px;
  text-align: center;
`;

const Tag = styled.span`
  background: #f1f5f9;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  color: #0f172a;
  margin: 20px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Description = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 30px;

  strong {
    color: #0f172a;
    font-weight: 700;
  }

  .highlight {
    color: #0070f3;
    font-weight: 600;
  }
`;

const QuoteBox = styled.div`
  border-left: 3px solid #0070f3;
  padding: 10px 0 10px 20px;
  text-align: left;
  margin: 40px auto 0 auto;
  max-width: 600px;

  p {
    font-style: italic;
    font-size: 1.05rem;
    color: #334155;
    margin-bottom: 4px;
  }

  span {
    color: #94a3b8;
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

export function CommunityMission() {
  return (
    <Section id="mission">
      <Container>
        <Tag>Warum das Ganze?</Tag>
        <Title>
          Ehrlich gesagt: Wir hatten einfach selbst keine Lust mehr.
        </Title>
        <Description>
          Die Story ist immer die gleiche: Man verabredet sich, fährt quer durch
          die Stadt, bestellt das erste Bier und merkt dann, dass auf der
          Leinwand <strong>Darts statt Derby</strong> läuft. Oder die Kneipe hat
          die Sky-Lizenz schon vor zwei Jahren abgegeben.
          <br />
          <br />
          <span className="highlight">wolaeuftfussball.de</span> ist ein Projekt
          von Fans für Fans. Wir werfen die Infos der Wirte mit dem{" "}
          <strong>Live-Check aus der Community</strong> zusammen. So wissen wir
          (fast) immer, wo wirklich angepfiffen wird.
        </Description>

        <QuoteBox>
          <p>
            "Ich wollte eine Seite, die funktioniert, wenn ich Samstag um 15:25
            Uhr noch einen Platz vor einer Leinwand suche."
          </p>
          <span>— Einer von uns</span>
        </QuoteBox>
      </Container>
    </Section>
  );
}
