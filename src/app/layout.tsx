import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClientBrief — Collecte de contenu client simplifiée",
  description:
    "Générez un lien unique, votre client remplit un wizard guidé, vous recevez un JSON structuré prêt à injecter dans vos templates.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
