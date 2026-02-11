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
        <FooterColumn>
          <h4>FUSSBALLSCHAUEN</h4>
          <p
            style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.6" }}
          >
            Die Community-Plattform für Fußballfans. Finde deine Kneipe,
            verifiziere das Programm und genieße den Anstoß.
          </p>
        </FooterColumn>

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
          </ul>
        </FooterColumn>

        <FooterColumn>
          <h4>Für Bar-Besitzer</h4>
          <ul>
            <li>
              <Link href="/add">Bar kostenlos eintragen</Link>
            </li>
            <li>
              <Link href="/owner-info">Vorteile für Betreiber</Link>
            </li>
          </ul>
        </FooterColumn>

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
        © {new Date().getFullYear()} Fussballschauen.de. Made with ⚽️ for Fans.
      </Copyright>
    </FooterContainer>
  );
}
