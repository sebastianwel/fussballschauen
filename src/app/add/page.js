import { Suspense } from "react";
import AddBarPage from "@/components/AddBarPage";

export const metadata = {
  title: "Bar hinzufügen | wolaeuftfussball.de",
  description:
    "Trage eine neue Fußballkneipe ein oder registriere deine eigene Bar direkt bei uns.",
};

export default function AddPage() {
  return (
    // Die Suspense-Boundary ist der Retter für den Vercel-Build
    <Suspense
      fallback={
        <div
          style={{ textAlign: "center", padding: "100px", color: "#64748b" }}
        >
          Formular wird geladen...
        </div>
      }
    >
      <AddBarPage />
    </Suspense>
  );
}
