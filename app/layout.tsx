import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Devbud. — We Purchase Properties. Developers Find Opportunity.",
  description: "Devbud. purchases Australian properties with confidence and connects developers with curated development sites. Finance arranged by All Credit Solutions.",
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
