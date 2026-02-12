"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Widgets importieren
import TeamWidget from "./TeamWidget";
import CompetitionVoting from "./CompetitionVoting";
import BackButton from "./BackButton";
import MatchSchedule from "./MatchSchedule";
import ClaimWidget from "./ClaimWidget";
import OwnerDashboard from "./OwnerDashboard";
import OpeningHoursWidget from "./OpeningHoursWidget";
import ContactWidget from "./ContactWidget";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// --- STYLES ---

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  background: ${(p) => (p.$isClaimed ? "#f0fdf4" : "white")};
  border: 1px solid ${(p) => (p.$isClaimed ? "#86efac" : "transparent")};
  padding: 2rem;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 2.3rem;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
`;

const Section = styled.section`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #dcfce7;
  color: #166534;
  padding: 2px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  border: 1px solid #86efac;
  vertical-align: middle;
`;

// --- KOMPONENTE ---

export default function DetailView({ bar }) {
  const [isOwner, setIsOwner] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.id === bar.owner_id) {
        setIsOwner(true);
        setEditMode(true);
      }
    };
    checkOwnership();
  }, [bar.owner_id]);

  // Falls bar nicht geladen wurde (Safety First)
  if (!bar) return null;

  // --- STRUCTURED DATA (JSON-LD) ---
  // Jetzt innerhalb der Funktion, damit 'bar' definiert ist!
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: bar.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: bar.address || "",
      addressLocality: bar.city || "",
      postalCode: bar.zip_code || "",
      addressCountry: "DE",
    },
    url: `https://wolaeuftfussball.de/bar/${bar.slug}`,
    telephone: bar.contact_info?.phone || "",
    openingHours: bar.opening_hours || "",
    image:
      bar.google_meta?.photo_url ||
      "https://wolaeuftfussball.de/default-bar.jpg",
  };

  const isAdmin = isOwner && editMode;

  return (
    <Container>
      {/* Google SEO Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackButton />

      {isOwner && (
        <OwnerDashboard
          bar={bar}
          editMode={editMode}
          setEditMode={setEditMode}
        />
      )}

      <Header $isClaimed={bar.is_claimed}>
        {bar.is_claimed && (
          <VerifiedBadge>✅ Inhaber-Verifiziert</VerifiedBadge>
        )}
        <Title>{bar.name}</Title>
        <div style={{ color: "#666" }}>
          📍 {bar.address ? bar.address : `${bar.zip_code} ${bar.city}`}
        </div>
      </Header>

      {/* Die Widgets */}
      <Section>
        <CompetitionVoting bar={bar} isAdmin={isAdmin} />
      </Section>

      <Section>
        <MatchSchedule
          bar={bar}
          matches={bar.upcomingMatches}
          isAdmin={isAdmin}
        />
      </Section>

      <Section>
        <TeamWidget bar={bar} isAdmin={isAdmin} />
      </Section>

      <Section>
        <SectionTitle>🕒 Öffnungszeiten</SectionTitle>
        <OpeningHoursWidget bar={bar} isAdmin={isAdmin} />
      </Section>

      <Section>
        <SectionTitle>📞 Kontakt & Info</SectionTitle>
        <ContactWidget bar={bar} isAdmin={isAdmin} />
      </Section>

      {!bar.is_claimed && (
        <Section>
          <ClaimWidget bar={bar} />
        </Section>
      )}
    </Container>
  );
}
