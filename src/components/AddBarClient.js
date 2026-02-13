import { Suspense } from "react";
import AddBarClient from "./AddBarClient";

export const metadata = {
  title: "Bar hinzufügen | wolaeuftfussball.de",
  description:
    "Trage eine neue Fußballkneipe ein oder registriere deine eigene Bar.",
};

export default function AddPage() {
  return (
    // Suspense ist der Retter für den Vercel-Build!
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: "100px" }}>
          Lade Formular...
        </div>
      }
    >
      <AddBarClient />
    </Suspense>
  );
}
