import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

// Orbitron for headers
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // you can adjust depending on needs
});

// Exo 2 for body text
const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // multiple weights for flexibility
});

export const metadata = {
  title: "AltVerse",
  description: "Collaborative storytelling universe builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${exo2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
