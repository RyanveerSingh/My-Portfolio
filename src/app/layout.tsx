import type { Metadata, Viewport } from "next";
import { Caveat, Inter, JetBrains_Mono, Luckiest_Guy, Space_Grotesk } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Logo: chunky comic letters, with a handwritten word inserted.
const logoFont = Luckiest_Guy({ subsets: ["latin"], weight: "400", variable: "--font-logo" });
const script = Caveat({ subsets: ["latin"], weight: ["700"], variable: "--font-script" });

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: "#0b0608",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable} ${logoFont.variable}`}>
      <head>
        <link rel="preload" as="image" href="/video/magic/1080/poster.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
