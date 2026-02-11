"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

const Nav = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.2rem;
  font-weight: 900;
  text-decoration: none;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    display: none; // Auf Mobile nutzen wir später ein Burger-Menü
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: #0070f3;
  }
`;

const AddButton = styled(Link)`
  background: #0070f3;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    background: #0056b3;
  }
`;

export function Header() {
  return (
    <Nav>
      <Logo href="/">
        ⚽️ <span style={{ letterSpacing: "-1px" }}>FUSSBALLSCHAUEN</span>
      </Logo>

      <NavLinks>
        <NavLink href="/search">Bars finden</NavLink>
        <NavLink href="/search?filter=bundesliga">Bundesliga</NavLink>
        <NavLink href="/#mission">Über uns</NavLink>
        <AddButton href="/add">Bar hinzufügen</AddButton>
      </NavLinks>

      {/* Mobile Toggle könnte hier hin */}
    </Nav>
  );
}
