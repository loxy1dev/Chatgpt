import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My AI",
  description: "Personal AI assistant"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}