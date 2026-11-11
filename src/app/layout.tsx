import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_Sinhala } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Used for Sinhala text in the tutorial (Geist has no Sinhala letters).
const sinhala = Noto_Sans_Sinhala({ variable: "--font-sinhala", subsets: ["sinhala"], preload: false });

export const metadata: Metadata = {
  title: "Price Checker",
  description: "Compare wholesale prices across shops and work out retail profit.",
  appleWebApp: { capable: true, title: "Price Checker", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#121211" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${sinhala.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <main className="mx-auto w-full max-w-3xl px-4 pt-4 pb-28">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
