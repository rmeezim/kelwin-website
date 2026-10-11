import type { Metadata } from "next";
import { Instrument_Sans, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "../styles/km-base.css";
import "../styles/km-kit.css";
import DiagnosticManualOverlay from "@/components/effects/DiagnosticManualOverlay";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
});

// Real monospace for the HUD/protocol labels — previously these fell back
// to system Consolas/Courier, the site's biggest "template" tell.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

// v5 type: Mona Sans (variable, self-hosted) carries everything; the width axis gives the
// display face its 110% wide cut. The declaration tells the browser the face spans 75–125%.
const monaSans = localFont({
  src: "./fonts/MonaSans.woff2",
  variable: "--font-mona",
  weight: "200 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
});

// Before first paint: allow entrance motion unless the visitor prefers reduced motion.
// Entrances wait (paused at their first frame) until their section plays; if the motion
// runtime never starts (no JS), the fallback drops the class so nothing stays hidden.
const motionBoot = `(function(){var d=document.documentElement;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("km-motion");setTimeout(function(){if(!d.classList.contains("km-live"))d.classList.remove("km-motion")},4000)})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kelwin — Revenue Infrastructure",
  description:
    "Kelwin designs, installs and runs the narrative, channel and market intelligence systems that turn fragmented growth into repeatable pipeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${monaSans.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-cream">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <DiagnosticManualOverlay />
        <div className="site-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
