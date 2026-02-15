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
  letter-spacing: 0.05em;
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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
  text-align: left;
`;

const FeatureItem = styled.div`
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
  }
`;

export function CommunityMission() {
  return (
    <Section id="mission">
      <Container>
        <Tag>Das Konzept</Tag>
        <Title>Alle Fußballkneipen auf einer Karte.</Title>
        <Description>
          <span className="highlight">wolaeuftfussball.de</span> ist ein offenes
          Verzeichnis für Sportbars in Deutschland. Wir bündeln Informationen zu
          Übertragungsrechten, Hausmannschaften und Öffnungszeiten an einem Ort,
          damit die Suche nach dem nächsten Anstoß nicht in Stress ausartet.
        </Description>

        <FeatureGrid>
          <FeatureItem>
            <h4>
              <span>📍</span> Regionaler Fokus
            </h4>
            <p>
              Finde Bars in deiner direkten Umgebung – egal ob in der Großstadt
              oder im Umland.
            </p>
          </FeatureItem>
          <FeatureItem>
            <h4>
              <span>🏆</span> Wettbewerbs-Check
            </h4>
            <p>
              Wir zeigen dir genau, welche Bar die Bundesliga, Champions League
              oder Regionalliga zeigt.
            </p>
          </FeatureItem>
          <FeatureItem>
            <h4>
              <span>🛡️</span> Verifizierte Daten
            </h4>
            <p>
              Durch unser Inhaber-Siegel und die Votes erkennst du sofort, wie
              aktuell die Infos sind.
            </p>
          </FeatureItem>
        </FeatureGrid>

        <Description style={{ marginTop: "40px", fontSize: "1rem" }}>
          Keine Anmeldung, keine Kosten, kein Tracking. Einfach nur Fußball in
          der Kneipe.
        </Description>
      </Container>
    </Section>
  );
}
