'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTools } from 'react-icons/fa';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-bramotors-black text-white w-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bramotors-black via-red-300/70 to-bramotors-black"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-center px-6 py-8 gap-6 text-center md:text-left">

        <div className="flex items-center justify-center md:justify-start gap-2">
          <Image
            src="/logo.png"
            alt="Bramotors Perú"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        <div className="text-sm text-center gap-2 leading-relaxed">
          {year !== null && (
            <>
              © {year} <span className="font-semibold">Bramotors Perú</span>. <br className="md:hidden" />
              Todos los derechos reservados.
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center md:justify-end gap-y-2 md:gap-x-6 text-sm text-center md:text-right whitespace-nowrap">
          <a href="/politica-privacidad" className="hover:underline">
            Política de Privacidad
          </a>
          <a href="/terminos-condiciones" className="hover:underline">
            Términos y Condiciones
          </a>
          <a href="#contact" className="hover:underline">
            Contacto
          </a>
        </div>

      </div>
      <button
        className="animate-bounce fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex items-center gap-2 lg bg-gradient-to-r from-white/10 to-white/5 text-white px-6 py-3 pr-8 rounded-full shadow-lg border-2 border-white/50 hover:bg-bramotors-red transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Habla con un experto de Bramotors"
      >
        <div className="relative">
          <FaTools className="w-6 h-6" />
        </div>
        <span className="font-semibold text-sm md:text-base tracking-wide">
          Habla con un experto
        </span>
      </button>
    </footer>
  );
}
