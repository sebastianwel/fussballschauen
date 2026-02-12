"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// --- STYLES ---

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

// Desktop Navigation
const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Standard Styles für Desktop
const NavLink = styled(Link)`
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s;
  &:hover {
    color: #0070f3;
  }
`;

const PortalLink = styled(Link)`
  text-decoration: none;
  color: #0f172a;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  &:hover {
    border-color: #0070f3;
    color: #0070f3;
  }
`;

const OwnerLink = styled(Link)`
  text-decoration: none;
  color: #166534;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: #f0fdf4;
  border-radius: 8px;
`;

const AddButton = styled(Link)`
  background: #0070f3;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
`;

// --- MOBILE SPECIFIC STYLES ---

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: calc(100vh - 70px);
  background: white;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;

  /* FIX 1: Auf Desktop komplett abschalten */
  @media (min-width: 769px) {
    display: none;
  }

  /* FIX 2: Nur sichtbar, wenn offen (verhindert das Flashen) */
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$isOpen ? "translateX(0)" : "translateX(100%)"};

  /* Die Transition nur auf transform anwenden, nicht auf alles */
  transition:
    transform 0.3s ease-in-out,
    visibility 0.3s;
`;

// Unified Mobile Link Style
const MobileMenuLink = styled(Link)`
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  transition: all 0.2s;

  /* Dynamische Farben basierend auf Props */
  background: ${(props) =>
    props.$variant === "primary"
      ? "#0070f3"
      : props.$variant === "success"
        ? "#f0fdf4"
        : "#f1f5f9"};
  color: ${(props) =>
    props.$variant === "primary"
      ? "white"
      : props.$variant === "success"
        ? "#166534"
        : "#0f172a"};
  border: 1px solid
    ${(props) =>
      props.$variant === "primary"
        ? "#0070f3"
        : props.$variant === "success"
          ? "#dcfce7"
          : "#e2e8f0"};
`;

const MobileLogoutBtn = styled.button`
  background: #fff;
  color: #ef4444;
  border: 1px solid #fee2e2;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  width: 100%;
  margin-top: auto; /* Schiebt Logout nach ganz unten */
`;

// --- KOMPONENTE ---

export function Header() {
  const [userBarSlug, setUserBarSlug] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verhindert das Scrollen des Hintergrunds, wenn das Menü offen ist
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    async function checkUserSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: bar } = await supabase
          .from("bars")
          .select("slug")
          .eq("owner_id", session.user.id)
          .maybeSingle();
        if (bar) setUserBarSlug(bar.slug);
      } else {
        setUserBarSlug(null);
      }
    }
    checkUserSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => checkUserSession());
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserBarSlug(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <Nav>
        <Logo href="/" onClick={closeMenu}>
          ⚽️ <span style={{ letterSpacing: "-1px" }}>WOLAEUFTFUSSBALL</span>
        </Logo>

        <NavLinks>
          <NavLink href="/search">Bars finden</NavLink>
          {userBarSlug ? (
            <>
              <OwnerLink href={`/bar/${userBarSlug}`}>🏟️ Dashboard</OwnerLink>
              <LogoutButton onClick={handleLogout}>Abmelden</LogoutButton>
            </>
          ) : (
            <>
              <PortalLink href="/owner-setup">Für Gastronomen</PortalLink>
              <NavLink href="/login">Login</NavLink>
              <AddButton href="/add-bar">Bar hinzufügen</AddButton>
            </>
          )}
        </NavLinks>

        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? "✕" : "☰"}
        </MenuButton>
      </Nav>

      <MobileOverlay $isOpen={isMenuOpen}>
        <MobileMenuLink href="/search" onClick={closeMenu}>
          🔍 Bars finden
        </MobileMenuLink>
        {userBarSlug ? (
          <>
            <MobileMenuLink
              href={`/bar/${userBarSlug}`}
              onClick={closeMenu}
              $variant="success"
            >
              🏟️ Mein Dashboard
            </MobileMenuLink>
            <MobileLogoutBtn onClick={handleLogout}>Abmelden</MobileLogoutBtn>
          </>
        ) : (
          <>
            <MobileMenuLink href="/owner-setup" onClick={closeMenu}>
              💼 Für Gastronomen
            </MobileMenuLink>
            <MobileMenuLink href="/login" onClick={closeMenu}>
              🔑 Inhaber Login
            </MobileMenuLink>
            <MobileMenuLink
              href="/add-bar"
              onClick={closeMenu}
              $variant="primary"
            >
              ➕ Bar hinzufügen
            </MobileMenuLink>
          </>
        )}
      </MobileOverlay>
    </>
  );
}
