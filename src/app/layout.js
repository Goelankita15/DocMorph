import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Compressify',
  description: 'All-in-one file compression and conversion tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <div className="ml-64 w-full p-6 bg-gray-50 min-h-screen">{children}</div>
      </body>
    </html>
  );
}