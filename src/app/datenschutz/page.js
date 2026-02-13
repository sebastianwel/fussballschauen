import DatenschutzClient from "@/components/DatenschutzClient";

export const metadata = {
  title: "Datenschutzerklärung | wolaeuftfussball.de",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf wolaeuftfussball.de gemäß DSGVO.",
  robots: "noindex, follow", // Rechtliche Seiten müssen nicht in die Top-Rankings
};

export default function DatenschutzPage() {
  return <DatenschutzClient />;
}
