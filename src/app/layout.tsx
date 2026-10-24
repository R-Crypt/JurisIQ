import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JurisIQ — Supreme Court of India Law Reports & Legal Research",
  description:
    "Comprehensive Supreme Court of India judgment repository and case law search. Access official judgment texts, equivalent citations (SCC, AIR, SCR), coram details, and precedent cross-references.",
  keywords: [
    "Supreme Court of India",
    "Judgments",
    "Case Law",
    "Legal Research",
    "SCC Online",
    "SCR",
    "AIR",
    "Indian Law Reports",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-slate-50/70 text-slate-900 font-sans">
        <TooltipProvider delay={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
