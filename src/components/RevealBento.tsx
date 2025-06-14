"use client"
import React from "react";
import { twMerge } from "tailwind-merge";
import Image from 'next/image';
import Link from "next/link";
import { HiOutlineColorSwatch, HiOutlineOfficeBuilding, HiOutlineUsers, HiOutlineViewGrid} from "react-icons/hi";
import { FaTools } from "react-icons/fa";

export const RevealBento = () => {
  return (
    <div className="w-full px-4 lg:px-24 text-white">
      <div className="mb-20 mx-auto grid grid-flow-dense grid-cols-12 gap-4 text-center">
        
        <div className="col-span-12 flex justify-center">
          <Link href="/">
        <Image 
          src="/logo.svg" 
          width={200} 
          height={100} 
          alt="Logo Digital Motors" 
          className="mt-2 rounded-lg"
        />
        </Link>
      </div>
        <HeaderBlock />
        <SocialsBlock />
      </div>
      <div className="flex justify-end">
<button
        className="animate-bounce md:bottom-6 md:right-6 z-50 flex items-center gap-2 lg bg-gradient-to-r from-white/10 to-white/5 text-white px-6 py-3 pr-8 rounded-full shadow-lg border-2 border-white/50 hover:bg-bramotors-red transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Habla con un experto de Bramotors"
      >
        <div className="relative">
          <FaTools className="w-6 h-6" />
        </div>
        <span className="font-semibold text-sm md:text-base tracking-wide">
          Habla con un experto
        </span>
      </button>
      </div>
      
    </div>
  );
};

type BlockProps = {
  className?: string;
  children?: React.ReactNode;
};

const Block = ({ className, children }: BlockProps) => {
  return (
    <div className={twMerge("col-span-4 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/10 shadow-md hover:shadow-lg transition -blur-lg", className)}>
      {children}
    </div>
  );
};

const HeaderBlock = () => (
  <Block className="col-span-12  row-span-2 md:col-span-6 p-6 flex items-center justify-center">
    <h1 className="hidden md:block gradient-text text-2xl font-bold leading-tight text-center">
    LA CALIDAD NO ES UN ACTO, <br />ES UN HÁBITO. CONSTRUYAMOS CON EXCELENCIA.
    </h1>

    <h1 className="block md:hidden gradient-text text-2xl font-bold leading-tight text-center">
    LA CALIDAD NO ES UN ACTO, ES UN HÁBITO. CONSTRUYAMOS CON EXCELENCIA.
    </h1>
    
  </Block>
);

const SocialsBlock = () => (
  <>
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3">
        <Link href="/sedes" className="place-items-center force-center">
            <HiOutlineOfficeBuilding className="text-5xl" />
            <h1 className="text-xl text-white">Sedes</h1>
        </Link>
    </Block>
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3 ">
        <Link href="/trabajadores" className="place-items-center force-center">
        <HiOutlineUsers className="text-5xl" />
        <h1 className="text-xl text-white">Trabajadores</h1>
        </Link>
    </Block>
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3">
    <Link href="/configuracion-producto" className=" place-items-center force-center">
            <HiOutlineColorSwatch className="text-5xl" />
        <h1 className="text-xl text-white">Categorías</h1>
    </Link>
    </Block>
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3">
        <Link href="/productos" className="place-items-center force-center">
            <HiOutlineViewGrid className="text-5xl" />
            <div className="text-xl">Productos</div>
        </Link>
    </Block>
  </>
);

type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
};


export default RevealBento;
