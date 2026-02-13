import { Suspense } from "react";
import OwnerSetupClient from "@/components/OwnerSetupClient";

export const metadata = {
  title: "Inhaber-Portal | wolaeuftfussball.de",
  description:
    "Verifiziere deine Bar, verwalte deine Wettbewerbe und erreiche mehr Fans.",
};

export default function OwnerSetupPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{ textAlign: "center", padding: "100px", color: "#64748b" }}
        >
          Portal wird geladen...
        </div>
      }
    >
      <OwnerSetupClient />
    </Suspense>
  );
}
