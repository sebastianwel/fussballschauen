"use client";
import styled from "styled-components";

const Section = styled.section`
  padding: 100px 20px;
  background-color: white;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 850px;
  text-align: center;
`;

const Tag = styled.span`
  background: #eff6ff;
  color: #0070f3;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  color: #0f172a;
  margin: 24px 0;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 40px;

  strong {
    color: #0f172a;
    font-weight: 700;
  }

  .highlight {
    background: linear-gradient(
      120deg,
      rgba(0, 112, 243, 0.1) 0%,
      rgba(0, 112, 243, 0.1) 100%
    );
    padding: 0 4px;
    border-radius: 4px;
    color: #0070f3;
    font-weight: 600;
  }
`;

const QuoteBox = styled.div`
  border-left: 4px solid #e2e8f0;
  padding-left: 24px;
  text-align: left;
  margin-top: 50px;

  p {
    font-style: italic;
    font-size: 1.1rem;
    color: #64748b;
    margin-bottom: 8px;
  }

  span {
    font-weight: 700;
    color: #1e293b;
    font-size: 0.9rem;
  }
`;

export function CommunityMission() {
  return (
    <Section id="mission">
      <Container>
        <Tag>Unsere Mission</Tag>
        <Title>Schluss mit dem Rätselraten vor der Kneipentür.</Title>
        <Description>
          Wir kennen das alle: Man verabredet sich mit Freunden, fährt quer
          durch die Stadt, bestellt das erste Kaltgetränk – und dann läuft auf
          dem Fernseher <strong>Darts statt Derby</strong>. Oder die Bar hat gar
          keine Sky-Lizenz mehr.
          <br />
          <br />
          <span className="highlight">Fussballschauen.de</span> wurde gegründet,
          um das zu ändern. Unsere Plattform ist keine statische Datenbank. Sie
          lebt durch <strong>dich</strong>. Durch die Kombination aus
          offiziellen Betreiber-Infos und dem{" "}
          <span className="highlight">Live-Check der Community</span> wissen wir
          immer ganz genau, wo der Ball rollt.
        </Description>

        <QuoteBox>
          <p>
            "Ich wollte eine Seite bauen, auf die ich mich verlassen kann, wenn
            ich Samstag um 15:20 Uhr noch auf der Suche nach einem Platz bin."
          </p>
          <span>— Der Gründer von Fussballschauen.de</span>
        </QuoteBox>
      </Container>
    </Section>
  );
}
