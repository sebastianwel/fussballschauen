"use client";
import React from "react";
import styled from "styled-components";

export default function DatenschutzClient() {
  return (
    <Page>
      <Container>
        <H1>Datenschutzerklärung</H1>

        <P>
          Wir freuen uns über Ihr Interesse an unserer Website. Der Schutz Ihrer
          Privatsphäre ist für uns von höchster Bedeutung. Nachstehend
          informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
        </P>

        <H2>1. Informationen über die Erhebung personenbezogener Daten</H2>
        <P>
          (1) Im Folgenden informieren wir über die Erhebung personenbezogener
          Daten bei Nutzung unserer Website. Personenbezogene Daten sind alle
          Daten, die auf Sie persönlich beziehbar sind, z. B. Name, Adresse,
          E-Mail-Adressen, Nutzerverhalten.
        </P>
        <P>
          (2) Verantwortlicher gem. Art. 4 Abs. 7 EU-Datenschutz-Grundverordnung
          (DSGVO) ist:
        </P>
        <div
          style={{
            background: "#f8fafc",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p>Sebastian Welzer</p>
          <br />
          Karolinenstr. 24
          <br />
          20357 Hamburg
          <br />
          Deutschland
          <br />
          <br />
          E-Mail: hallo@wolaeuftfussball.de
        </div>

        <H2>2. Ihre Rechte</H2>
        <P>
          Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie
          betreffenden personenbezogenen Daten:
        </P>
        <UL>
          <LI>Recht auf Auskunft (Art. 15 DSGVO),</LI>
          <LI>Recht auf Berichtigung oder Löschung (Art. 16 und 17 DSGVO),</LI>
          <LI>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO),</LI>
          <LI>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO),</LI>
          <LI>Recht auf Datenübertragbarkeit (Art. 20 DSGVO).</LI>
        </UL>
        <P>
          Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
          über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu
          beschweren (Art. 77 DSGVO).
        </P>

        <H2>3. Erhebung personenbezogener Daten bei Besuch unserer Website</H2>
        <H3>A. Server-Log-Files (Hosting durch Vercel)</H3>
        <P>
          Bei der bloß informatorischen Nutzung der Website, also wenn Sie sich
          nicht registrieren oder uns anderweitig Informationen übermitteln,
          erheben wir nur die personenbezogenen Daten, die Ihr Browser an
          unseren Server übermittelt. Wir hosten unsere Seite bei{" "}
          <strong>Vercel (Vercel Inc., USA)</strong>. Folgende Daten sind
          technisch erforderlich, um Ihnen unsere Website anzuzeigen und die
          Stabilität und Sicherheit zu gewährleisten (Rechtsgrundlage ist Art. 6
          Abs. 1 S. 1 lit. f DSGVO):
        </P>
        <UL>
          <LI>IP-Adresse</LI>
          <LI>Datum und Uhrzeit der Anfrage</LI>
          <LI>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</LI>
          <LI>Inhalt der Anforderung (konkrete Seite)</LI>
          <LI>Zugriffsstatus/HTTP-Statuscode</LI>
          <LI>jeweils übertragene Datenmenge</LI>
          <LI>Website, von der die Anforderung kommt</LI>
          <LI>Browser, Betriebssystem und dessen Oberfläche</LI>
          <LI>Sprache und Version der Browsersoftware.</LI>
        </UL>

        <H3>B. Cookies & Local Storage</H3>
        <P>
          Zusätzlich zu den zuvor genannten Daten werden bei Ihrer Nutzung
          unserer Website Cookies auf Ihrem Rechner gespeichert. Cookies sind
          kleine Textdateien, die auf Ihrer Festplatte dem von Ihnen verwendeten
          Browser zugeordnet gespeichert werden. Wir nutzen zudem den{" "}
          <strong>Local Storage</strong> Ihres Browsers, um bspw. Ihre
          Entscheidung bezüglich des Cookie-Banners oder Ihren Anmeldestatus zu
          speichern.
        </P>
        <P>
          Rechtsgrundlage für technisch notwendige Cookies/Speicherungen ist
          Art. 6 Abs. 1 lit. f DSGVO. Für alle anderen (Analyse/Marketing) ist
          Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO erforderlich.
        </P>

        <H2>4. Spezielle Dienste auf wolaeuftfussball.de</H2>

        <H3>A. Supabase (Datenbank & Authentifizierung)</H3>
        <P>
          Wir nutzen <strong>Supabase (Supabase Inc., USA)</strong> für das
          Backend unserer Website. Dies umfasst die Datenbankverwaltung sowie
          die Authentifizierung von Nutzern (insbesondere Bar-Inhaber). Wenn Sie
          sich registrieren, werden Ihre E-Mail-Adresse sowie von Ihnen
          eingegebene Bar-Daten verschlüsselt auf den Servern von Supabase
          gespeichert.
        </P>
        <P>
          Die Übermittlung der Daten in die USA erfolgt auf Grundlage von
          Standardvertragsklauseln der EU-Kommission. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. b DSGVO (Vertragserfüllung bei Registrierung) sowie unser
          berechtigtes Interesse an einer sicheren Infrastruktur (Art. 6 Abs. 1
          lit. f DSGVO).
        </P>

        <H3>B. Leaflet & OpenStreetMap (Kartenmaterial)</H3>
        <P>
          Zur Darstellung von Fußballbars in Ihrer Nähe nutzen wir
          Kartenmaterial der <strong>OpenStreetMap Foundation (OSMF)</strong>{" "}
          via Leaflet. Bei Aufruf der Karte wird eine Verbindung zu den Servern
          der OSMF hergestellt. Dabei wird Ihre IP-Adresse übertragen.
        </P>
        <P>
          Rechtsgrundlage ist unser berechtigtes Interesse an einer
          nutzerfreundlichen Darstellung unserer Standorte gemäß Art. 6 Abs. 1
          lit. f DSGVO. Die OSMF hat ihren Sitz im Vereinigten Königreich,
          welches durch einen Angemessenheitsbeschluss der EU-Kommission als
          sicherer Drittstaat gilt.
        </P>

        <H3>C. Google Analytics (Tracking)</H3>
        <P>
          Sofern Sie eingewilligt haben, nutzen wir Google Analytics. Wir setzen
          Google Analytics nur mit aktivierter{" "}
          <strong>IP-Anonymisierung</strong> ein. Das bedeutet, Ihre IP-Adresse
          wird von Google innerhalb von Mitgliedstaaten der EU oder in anderen
          Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum
          gekürzt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.
        </P>

        <H2>5. Widerspruch oder Widerruf gegen die Verarbeitung Ihrer Daten</H2>
        <P>
          Falls Sie eine Einwilligung zur Verarbeitung Ihrer Daten erteilt
          haben, können Sie diese jederzeit widerrufen. Ein solcher Widerruf
          beeinflusst die Zulässigkeit der Verarbeitung Ihrer personenbezogenen
          Daten, nachdem Sie ihn gegenüber uns ausgesprochen haben.
        </P>
        <P>
          <strong>
            Soweit wir die Verarbeitung Ihrer personenbezogenen Daten auf die
            Interessenabwägung stützen, können Sie Widerspruch gegen die
            Verarbeitung einlegen.
          </strong>{" "}
          Dies ist der Fall, wenn die Verarbeitung insbesondere nicht zur
          Erfüllung eines Vertrags mit Ihnen erforderlich ist.
        </P>

        <H2>6. Aktualität</H2>
        <P>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand
          Februar 2026.
        </P>
      </Container>
    </Page>
  );
}

/* --- STYLES --- */

const Page = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px 100px; /* Weniger Abstand zum Rand auf Mobile */
  background-color: #f8fafc;

  @media (min-width: 768px) {
    padding: 60px 20px 100px;
  }
`;

const Container = styled.div`
  background: white;
  padding: 20px; /* Kleinerer Einstiegswert für Mobile */
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);

  /* WICHTIG: Verhindert, dass langer Text den Rahmen sprengt */
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;

  @media (min-width: 768px) {
    padding: 50px; /* Voller Abstand auf dem Desktop */
  }
`;

const H1 = styled.h1`
  font-size: 1.8rem; /* Kleiner auf Mobile */
  margin-bottom: 2rem;
  color: #0f172a;
  font-weight: 900;
  letter-spacing: -1px;
  border-bottom: 4px solid #0070f3;
  display: inline-block;
  padding-bottom: 5px;
  line-height: 1.1;

  @media (min-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: -1.5px;
  }
`;

const H2 = styled.h2`
  font-size: 1.4rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #0f172a;
  font-weight: 800;

  @media (min-width: 768px) {
    font-size: 1.6rem;
    margin-top: 3rem;
  }
`;

const H3 = styled.h3`
  font-size: 1.15rem;
  margin-top: 1.8rem;
  margin-bottom: 0.8rem;
  color: #1e293b;
  font-weight: 700;
`;

const P = styled.p`
  line-height: 1.6; /* Etwas kompakter für bessere Lesbarkeit auf Mobile */
  color: #475569;
  margin-bottom: 1.2rem;
  font-size: 0.95rem;

  @media (min-width: 768px) {
    line-height: 1.8;
    font-size: 1rem;
  }

  strong {
    color: #0f172a;
  }
`;

const UL = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.2rem;
  list-style-type: square;
`;

const LI = styled.li`
  margin-bottom: 0.8rem;
  line-height: 1.5;
  color: #475569;
  font-size: 0.95rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;
