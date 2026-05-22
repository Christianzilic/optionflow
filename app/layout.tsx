import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "OptionFlow — Property Development Options | Powered by All Credit Solutions",
  description: "OptionFlow connects Australian property owners with developers via call option deeds. Development finance arranged by All Credit Solutions — $500K–$50M, 15+ years experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
