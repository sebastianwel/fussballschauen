import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css"; // Kannst du behalten für Reset, oder leeren
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Fussballkneipen",
  description: "Finde die beste Bar für dein Spiel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <Header />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <Footer />
      </body>
    </html>
  );
}
