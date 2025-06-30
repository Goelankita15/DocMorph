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
  title: 'Compressify - File Utility Suite',
  description: 'All-in-one file compression and conversion tool with beautiful UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-full bg-gradient-to-br from-slate-50 to-gray-100`}>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <Sidebar />
        <main className="ml-72 flex-1 min-h-screen overflow-y-auto">
          <div className="p-8 min-h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}