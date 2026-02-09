import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css"; // Kannst du behalten für Reset, oder leeren

export const metadata = {
  title: "Fussballkneipen",
  description: "Finde die beste Bar für dein Spiel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
