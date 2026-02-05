import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaProviders } from "@/providers/SolanaProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Formo Solana Example",
  description: "Example dApp demonstrating Formo Analytics with Solana wallet adapter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaProviders>{children}</SolanaProviders>
      </body>
    </html>
  );
}
