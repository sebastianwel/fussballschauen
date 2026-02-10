"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { TEAMS } from "@/lib/constants";

// --- STYLES ---
const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #0070f3;
    box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 5px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 0;
  text-align: left; /* Wichtig, damit Text linksbündig ist */
`;

const Item = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  font-size: 0.95rem;
  color: #333;

  &:hover {
    background: #f0f9ff;
    color: #0070f3;
  }

  &:last-child {
    border-bottom: none;
  }
`;

// --- COMPONENT ---
export default function TeamSelector({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Ref für Klick außerhalb (um Dropdown zu schließen)
  const wrapperRef = useRef(null);

  // Sync falls Parent den Wert ändert
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Schließt Dropdown wenn man woanders hinklickt
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);

    // Wir geben den Wert sofort an den Parent zurück (auch wenn noch nicht ausgewählt)
    // Damit man auch "Dorfverein 1902" eingeben kann, der nicht in der Liste ist.
    onChange(userInput);

    if (userInput.length > 1) {
      const filtered = TEAMS.filter((team) =>
        team.name.toLowerCase().includes(userInput.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (team) => {
    setQuery(team);
    onChange(team); // Finaler Wert an Parent
    setShowDropdown(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Input
        type="text"
        placeholder="z.B. Hamburger SV..."
        value={query}
        onChange={handleInput}
        onFocus={() => query.length > 1 && setShowDropdown(true)}
      />

      {showDropdown && suggestions.length > 0 && (
        <Dropdown>
          {suggestions.map((team, index) => (
            <Item key={index} onClick={() => handleSelect(team.name)}>
              {team.name}
            </Item>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}
