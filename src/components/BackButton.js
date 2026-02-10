"use client";

import styled from "styled-components";

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0;
  margin-bottom: 20px;
  transition: color 0.2s;

  &:hover {
    color: #0070f3;
  }
`;

export default function BackButton() {
  return (
    <StyledButton onClick={() => window.history.back()}>
      <span>←</span> Zurück zur Suche
    </StyledButton>
  );
}
