"use client";

import styled from "styled-components";

const AdminBar = styled.div`
  background: #0f172a;
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column; /* Standard für Mobile: Untereinander */
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #1e293b;

  @media (min-width: 640px) {
    flex-direction: row; /* Ab Tablet/Desktop: Nebeneinander */
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
  }
`;

const StatusTag = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;

  @media (max-width: 640px) {
    justify-content: center; /* Zentriert den Status auf dem Handy */
    border-bottom: 1px solid #1e293b;
    padding-bottom: 12px;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center; /* Zentriert die Steuerung auf dem Handy */

  @media (min-width: 640px) {
    gap: 20px;
  }
`;

const ViewLabel = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;

  @media (max-width: 400px) {
    display: none; /* Versteckt "Ansicht:" auf extrem kleinen Bildschirmen */
  }
`;

const Pulse = styled.div`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  background: #1e293b;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
  flex: 1; /* Nimmt auf Mobile den verfügbaren Platz ein */
  max-width: 300px; /* Begrenzt die Breite auf Desktop */
`;

const ToggleBtn = styled.button`
  background: ${(props) => (props.$active ? "#0070f3" : "transparent")};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1; /* Macht beide Buttons gleich breit */
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? "#0070f3" : "#334155")};
  }
`;

export default function OwnerDashboard({ bar, editMode, setEditMode }) {
  return (
    <AdminBar>
      <StatusTag>
        <Pulse />
        Eingeloggt als Inhaber
      </StatusTag>

      <ControlGroup>
        <ViewLabel>Ansicht:</ViewLabel>
        <ToggleContainer>
          <ToggleBtn $active={!editMode} onClick={() => setEditMode(false)}>
            Vorschau
          </ToggleBtn>
          <ToggleBtn $active={editMode} onClick={() => setEditMode(true)}>
            Bearbeiten ✏️
          </ToggleBtn>
        </ToggleContainer>
      </ControlGroup>
    </AdminBar>
  );
}
