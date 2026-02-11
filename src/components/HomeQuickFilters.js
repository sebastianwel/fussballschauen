"use client";

import styled from "styled-components";
import Link from "next/link";

const QuickFilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const QuickLink = styled(Link)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s;

  &:hover {
    background: white;
    color: #0f172a;
    transform: translateY(-2px);
  }
`;

export function HomeQuickFilters() {
  // Diese IDs entsprechen jetzt exakt deiner COMPETITIONS Liste in lib/constants.js
  const popular = [
    { name: "Bundesliga", id: "bundesliga" },
    { name: "2. Bundesliga", id: "bundesliga2" },
    { name: "Champions League", id: "champions_league" },
    { name: "DFB Pokal", id: "dfb_pokal" },
  ];

  return (
    <QuickFilterWrapper>
      {popular.map((item) => (
        <QuickLink
          key={item.id}
          // Der SearchClient erkennt den 'filter' Parameter beim Laden
          href={`/search?filter=${item.id}`}
        >
          {item.name}
        </QuickLink>
      ))}
    </QuickFilterWrapper>
  );
}
