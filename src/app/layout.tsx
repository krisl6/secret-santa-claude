import type { Metadata } from "next";
import { Geist, Geist_Mono, Mountains_of_Christmas } from "next/font/google";
import "./globals.css";
import Snowflakes from "@/components/Snowflakes";
import { ThemeProvider } from "@/components/ThemeProvider";
import YukiChatbot from "@/components/YukiChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mountainsOfChristmas = Mountains_of_Christmas({
  variable: "--font-christmas",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  fallback: ["serif"],
});

export const metadata: Metadata = {
  title: "Secret Santa",
  description: "Organize your team's gift exchange with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${mountainsOfChristmas.variable} antialiased`}
      >
        <ThemeProvider>
          <Snowflakes />
          {children}
          <YukiChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
