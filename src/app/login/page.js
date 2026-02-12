"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Styles (analog zu OwnerSetup für Konsistenz)
const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  &:disabled {
    background: #cbd5e1;
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login fehlgeschlagen: " + error.message);
      setLoading(false);
    } else {
      // Nach dem Login suchen wir die Bar des Users, um ihn dorthin zu schicken
      const { data: bar } = await supabase
        .from("bars")
        .select("slug")
        .eq("owner_id", data.user.id)
        .single();

      if (bar) {
        router.push(`/bar/${bar.slug}`);
      } else {
        router.push("/"); // Fallback falls er (noch) keine Bar hat
      }
      router.refresh();
    }
  };

  return (
    <Container>
      <h1>Willkommen zurück ⚽️</h1>
      <p style={{ color: "#64748b", marginBottom: "20px" }}>
        Logge dich ein, um deine Bar zu verwalten.
      </p>
      <form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="E-Mail Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Einstoppen..." : "Anmelden"}
        </Button>
      </form>
    </Container>
  );
}
