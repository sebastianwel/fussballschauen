"use client";

import styled from "styled-components";
import Link from "next/link";

const FooterContainer = styled.footer`
  background: #0f172a;
  color: white;
  padding: 80px 20px 40px 20px;
  margin-top: 80px;
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 40px;
`;

const FooterColumn = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 12px;
  }

  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 40px auto 0 auto;
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
`;

export function Footer() {
  return (
    <FooterContainer>
      <FooterGrid>
        {/* BRAND & MISSION */}
        <FooterColumn>
          <h4>WOLAEUFTFUSSBALL.DE</h4>
          <p
            style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.6" }}
          >
            Dein Guide für Fußball live in der Kneipe. Finde die besten
            Sportbars in deiner Stadt, verifiziere das Programm und verpasse
            keinen Anstoß mehr.
          </p>
        </FooterColumn>

        {/* SEO CITY LINKS */}
        <FooterColumn>
          <h4>Beliebte Städte</h4>
          <ul>
            <li>
              <Link href="/in/hamburg">Hamburg</Link>
            </li>
            <li>
              <Link href="/in/berlin">Berlin</Link>
            </li>
            <li>
              <Link href="/in/muenchen">München</Link>
            </li>
            <li>
              <Link href="/in/koeln">Köln</Link>
            </li>
            <li>
              <Link href="/search">Alle Städte anzeigen</Link>
            </li>
          </ul>
        </FooterColumn>

        {/* COMPETITIONS */}
        <FooterColumn>
          <h4>Wettbewerbe</h4>
          <ul>
            <li>
              <Link href="/search?filter=bundesliga">Bundesliga</Link>
            </li>
            <li>
              <Link href="/search?filter=champions_league">
                Champions League
              </Link>
            </li>
            <li>
              <Link href="/search?filter=dfb_pokal">DFB Pokal</Link>
            </li>
            <li>
              <Link href="/search?filter=premier_league">Premier League</Link>
            </li>
          </ul>
        </FooterColumn>

        {/* OWNER AREA */}
        <FooterColumn>
          <h4>Für Gastronomen</h4>
          <ul>
            <li>
              <Link href="/add">Bar kostenlos eintragen</Link>
            </li>
            <li>
              <Link href="/owner-setup">Vorteile für Wirte</Link>
            </li>
            <li>
              <Link href="/login">Inhaber Login</Link>
            </li>
          </ul>
        </FooterColumn>

        {/* LEGAL */}
        <FooterColumn>
          <h4>Rechtliches</h4>
          <ul>
            <li>
              <Link href="/impressum">Impressum</Link>
            </li>
            <li>
              <Link href="/datenschutz">Datenschutz</Link>
            </li>
          </ul>
        </FooterColumn>
      </FooterGrid>

      <Copyright>
        © {new Date().getFullYear()} wolaeuftfussball.de. Made with ⚽️ for Fans.
      </Copyright>
    </FooterContainer>
  );
}
