import ImpressumClient from "@/components/ImpressumClient";

export const metadata = {
  title: "Impressum | wolaeuftfussball.de",
  description:
    "Rechtliche Anbieterkennzeichnung und Kontaktinformationen für wolaeuftfussball.de.",
  robots: "index, follow",
  alternates: {
    canonical: "/impressum",
  },
};

export default function ImpressumPage() {
  return <ImpressumClient />;
}
