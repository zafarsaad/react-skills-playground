import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Playground React",
  description: "A playground to tinker with React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`bg-white text-gray-900 antialiased ${geistSans.variable} ${geistMono.variable} font-sans`}
      >
        <header className="bg-blue-600 text-white px-6 py-4 shadow">
          <h1 className="text-2xl font-bold">
            <Link href="/">React Skills Playground</Link>
          </h1>
        </header>
        <main className="p-6 max-w-4xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
