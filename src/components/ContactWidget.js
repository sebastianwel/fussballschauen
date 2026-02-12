"use client";
import { useState } from "react";
import styled from "styled-components";
import { updateBarData } from "@/actions/updateBarData";

const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #eee;
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #0070f3;
`;
const SaveBtn = styled.button`
  background: #22c55e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;

export default function ContactWidget({ bar, isAdmin }) {
  const [contact, setContact] = useState(bar.contact_info || {});
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await updateBarData(bar.id, { contact_info: contact });
    setLoading(false);
  };

  const getSafeUrl = (url) =>
    !url ? "" : url.startsWith("http") ? url : `https://${url}`;

  return (
    <Card>
      {isAdmin ? (
        <>
          <label style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
            WEBSEITE
          </label>
          <Input
            value={contact.website || ""}
            onChange={(e) =>
              setContact({ ...contact, website: e.target.value })
            }
            placeholder="https://..."
          />
          <label style={{ fontSize: "0.7rem", fontWeight: "bold" }}>
            TELEFON
          </label>
          <Input
            value={contact.phone || ""}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="040..."
          />
          <SaveBtn onClick={save}>
            {loading ? "..." : "Kontakt speichern"}
          </SaveBtn>
        </>
      ) : (
        <>
          {bar.contact_info?.website && (
            <div style={{ marginBottom: 10 }}>
              🌐{" "}
              <a
                href={getSafeUrl(bar.contact_info.website)}
                target="_blank"
                style={{ color: "#0070f3", fontWeight: 600 }}
              >
                Webseite besuchen
              </a>
            </div>
          )}
          {bar.contact_info?.phone && (
            <div>
              📞{" "}
              <a
                href={`tel:${bar.contact_info.phone}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                {bar.contact_info.phone}
              </a>
            </div>
          )}
          {!bar.contact_info?.website && !bar.contact_info?.phone && (
            <span style={{ color: "#999" }}>Keine Daten</span>
          )}
        </>
      )}
    </Card>
  );
}
