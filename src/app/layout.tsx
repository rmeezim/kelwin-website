import type { Metadata } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";
import AmbientGrid from "@/components/effects/AmbientGrid";
import CustomCursor from "@/components/effects/CustomCursor";
import DiagnosticManualOverlay from "@/components/effects/DiagnosticManualOverlay";
import SmoothScrollProvider from "@/components/effects/SmoothScrollProvider";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
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
      className={`${instrumentSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-cream">
        <AmbientGrid />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <DiagnosticManualOverlay />
        <CustomCursor />
      </body>
    </html>
  );
}
