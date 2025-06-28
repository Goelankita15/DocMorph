'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navLinks = [
  { href: '/', label: 'About' },
  { href: '/uploadImage', label: 'Image Compressor' },
  { href: '/uploadPdf', label: 'PDF Compressor' },
  { href: '/split', label: 'Split PDF' },
  { href: '/merge', label: 'Merge PDF' },
  { href: '/ImagetoPDF', label: 'Image to PDF' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-100 shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Compressify</h2>
      <nav className="space-y-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg font-medium transition 
              ${pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-blue-200'}
            `}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
