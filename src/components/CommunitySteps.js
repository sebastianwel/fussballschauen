"use client";

import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  padding: 80px 20px;
  background: #f8fafc;
`;

const StepGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const StepCard = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out both;
  animation-delay: ${(props) => props.$delay}s;

  .number-badge {
    width: 40px;
    height: 40px;
    background: #0070f3;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    margin: 0 auto 20px auto;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 15px;
    color: #0f172a;
  }

  p {
    color: #64748b;
    line-height: 1.6;
  }
`;

export function CommunitySteps() {
  return (
    <Section>
      <StepGrid>
        <StepCard $delay={0.1}>
          <div className="number-badge">1</div>
          <h3>Suche in deiner Nähe</h3>
          <p>
            Gib deine Stadt oder deinen Standort ein, um alle Fußballkneipen in
            deiner Nähe zu sehen. Filtere die Ergebnisse danach einfach nach
            Wettbewerb oder deinem Lieblingsteam.
          </p>
        </StepCard>
        <StepCard $delay={0.2}>
          <div className="number-badge">2</div>
          <h3>Alles auf einen Blick</h3>
          <p>
            Checke Wettbewerbe, Öffnungszeiten und die Hausmannschaft. Wir
            bündeln alle Infos an einem Ort, damit du nie wieder vor
            verschlossenen Türen stehst.
          </p>
        </StepCard>
        <StepCard $delay={0.3}>
          <div className="number-badge">3</div>
          <h3>Der Community-Gedanke</h3>
          <p>
            Von Fans für Fans: Entdecke neue Lieblingsorte, teile deine
            Geheimtipps und sorge dafür, dass kein Fußballfan mehr allein vor
            dem kleinen Bildschirm sitzen muss.
          </p>
        </StepCard>
      </StepGrid>
    </Section>
  );
}
