import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RocNest - Gestión de Material de Montaña",
  description: "Sistema de gestión y reserva de material de montaña para clubes y organizaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${lexend.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

