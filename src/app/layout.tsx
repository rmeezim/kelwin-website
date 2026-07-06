import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AmbientGrid from "@/components/effects/AmbientGrid";
import DiagnosticManualOverlay from "@/components/effects/DiagnosticManualOverlay";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
});

// Editorial serif — used sparingly, italic, for the pull-quote codas that
// punctuate each section. Adds gravitas the all-grotesque system lacked.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

// Real monospace for the HUD/protocol labels — previously these fell back
// to system Consolas/Courier, the site's biggest "template" tell.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kelwin — Revenue Infrastructure",
  description:
    "Kelwin builds revenue infrastructure and GTM intelligence systems designed to transition growth from instability to institutional permanence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-cream">
        <AmbientGrid />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <DiagnosticManualOverlay />
        <div className="site-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
