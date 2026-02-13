"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";

const Banner = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #0f172a;
  color: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 1px solid #1e293b;
  max-width: 500px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
  }
`;

const Text = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #94a3b8;
  margin: 0;
  flex: 1;

  a {
    color: #38bdf8;
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background: #0070f3;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;

  &:hover {
    background: #0061d5;
  }
`;

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);

    // Signal an den Wrapper senden
    window.dispatchEvent(new Event("cookie-consent-given"));
  };

  if (!isVisible) return null;

  return (
    <Banner>
      <Text>
        Wir nutzen Cookies, um dir die Suche nach der nächsten Kneipe so einfach
        wie möglich zu machen (z.B. für den Login). Infos dazu findest du in
        unserer <Link href="/datenschutz">Datenschutzerklärung</Link>.
      </Text>
      <Button onClick={acceptCookies}>Alles klar!</Button>
    </Banner>
  );
}
