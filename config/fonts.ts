import { Inter as FontSans, Fira_Code as FontMono } from "next/font/google";

/** Sans-serif font token configuration */
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/** Monospace font token configuration */
export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
