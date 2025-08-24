import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: "Nooro Todo App",
  description: "Nooro Full-stack dev Take-home Test",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`${inter.className} min-h-dvh flex flex-col`}>
    {/* Header */}
    <Header/>
    
    {children}
    </body>
    </html>
  );
}
