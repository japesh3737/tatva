import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tatva | Bespoke Interior Architecture & Design Studio",
  description:
    "Tatva transforms spaces into soulful sanctuaries through timeless materiality, thoughtful minimalism, and architectural precision.",
  keywords: [
    "Tatva",
    "Interior Design Studio",
    "Bespoke Interiors",
    "Architecture",
    "Luxury Homes",
    "Turnkey Execution",
    "Hinglish",
    "Ghar Ko Do Naya Roop"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-[#4A0A00] text-[#F6EAD8]">
      <body className="min-h-full flex flex-col bg-[#4A0A00] text-[#F6EAD8]">
        {children}
      </body>
    </html>
  );
}
