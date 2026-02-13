"use client";
import React from "react";
import styled from "styled-components";

export default function ImpressumClient() {
  return (
    <Page>
      <Container>
        <H1>Impressum</H1>

        <H2>Angaben gemäß § 5 DDG</H2>
        <P>
          Sebastian Welzer
          <br />
          Karolinenstr. 24
          <br />
          20357 Hamburg
          <br />
          Deutschland
        </P>

        <H2>Kontakt</H2>
        <P>E-Mail: hallo@wolaeuftfussball.de</P>

        <H2>Redaktionell verantwortlich</H2>
        <P>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
          <br />
          Sebastian Welzer
          <br />
          Karolinenstr. 24
          <br />
          20357 Hamburg
        </P>

        <H2>EU-Streitschlichtung</H2>
        <P>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
          .<br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </P>

        <H2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</H2>
        <P>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </P>

        <H2>Haftung für Inhalte</H2>
        <P>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </P>
        <P>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten
          Rechtsverletzung möglich.
        </P>

        <H2>Haftung für Links</H2>
        <P>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </P>

        <H2>Urheberrecht</H2>
        <P>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers.
        </P>
      </Container>
    </Page>
  );
}

/* -----------------------------
   STYLES (Angepasst an wolaeuftfussball.de)
------------------------------ */
const Page = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px 100px;
  background-color: #f8fafc;
`;

const Container = styled.div`
  background: white;
  padding: 50px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
`;

const H1 = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  color: #0f172a;
  font-weight: 900;
  letter-spacing: -1.5px;
  border-bottom: 4px solid #0070f3;
  display: inline-block;
  padding-bottom: 5px;
`;

const H2 = styled.h2`
  font-size: 1.4rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #0f172a;
  font-weight: 800;
  border-left: 4px solid #38bdf8;
  padding-left: 15px;
`;

const P = styled.p`
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.2rem;
  font-size: 1rem;

  a {
    color: #0070f3;
    text-decoration: underline;
    font-weight: 600;
  }
`;
