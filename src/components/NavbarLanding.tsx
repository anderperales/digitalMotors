'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full absolute top-0 left-0 z-48 bg-transparent text-white py-6 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Bramotors Logo"
              width={250}
              height={100}
              className="object-contain"
            />
          </div>
        </Link>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        <div className={`flex-col md:flex md:flex-row md:items-center gap-6 ${isOpen ? 'flex' : 'hidden'} absolute md:static top-full left-0 w-full md:w-auto bg-black/90 md:bg-transparent p-6 md:p-0`}>
          <Link href="#services" className="hover:underline text-sm font-medium">
            ¿Qué hacemos?
          </Link>
          <Link href="#locations" className="hover:underline text-sm font-medium">
            ¿Dónde nos ubicamos?
          </Link>
          <Link href="#promotions" className="hover:underline text-sm font-medium">
            Nuestras promociones
          </Link>
          <Link
            href="#contact"
            className="px-4 py-2 border border-white rounded-full text-sm font-semibold hover:bg-bramotors-red hover:text-nubex-primary transition"
          >
            Agenda tu cita
          </Link>
        </div>
      </div>
    </nav>
  );
}
