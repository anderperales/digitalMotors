"use client"
import React from "react";
import { twMerge } from "tailwind-merge";
import { FiBookOpen } from "react-icons/fi";
import Image from 'next/image';
import Link from "next/link";
import { handleButtonClick } from "./whatsappUtils";
import { HiOutlineClipboardCheck, HiOutlineUsers, HiOutlineViewGrid} from "react-icons/hi";

export const RevealBento = () => {
  return (
    <div className="w-full px-4 lg:px-24 text-white">
      <div className="mb-20 mx-auto grid grid-flow-dense grid-cols-12 gap-4 text-center">
        <HeaderBlock />
        <SocialsBlock />
        <div className="col-span-12 flex justify-center">
        <Image 
          src="/logo.svg" 
          width={200} 
          height={100} 
          alt="Logo Digital Motors" 
          className="mt-2 rounded-lg"
        />
      </div>
      </div>
      <div className="flex justify-end">
      <button className="relative  bg-blue-800 border-2 p-4 rounded-full text-white items-center md:flex transition-transform transform hover:scale-105 active:scale-95"
        onClick={() => handleButtonClick("+51967203938", "Hola, me gustaría saber más sobre otro servicio")}>
          <span className='font-bold'> ¿Tienes dudas?</span>
          <Image className='absolute -mt-12 -ml-20 transition-transform transform hover:scale-105 active:scale-95 animate-bounce' src="/bot.png" width={100} height={100} alt="contacto" />
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
    <div className={twMerge("col-span-4 rounded-lg", className)}>
      {children}
    </div>
  );
};

const HeaderBlock = () => (
  <Block className="col-span-12 bg-blue-800  border-white border-2 backdrop-blur-lg row-span-2 md:col-span-6 p-6 flex items-center justify-center">
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
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3 border-white border-2 bg-blue-800 backdrop-blur-lg">
        <Link href="/cuaderno-de-obra" className="place-items-center force-center">
            <FiBookOpen className="text-5xl" />
            <h1 className="text-xl text-white">Cuaderno</h1>
        </Link>
    </Block>
    <Block className="min-h-[100px] flex items-center justify-center col-span-6 md:col-span-3 border-white border-2 bg-blue-800 backdrop-blur-lg">
        <Link href="/asistencia" className="place-items-center force-center">
        <HiOutlineUsers className="text-5xl" />
        <h1 className="text-xl text-white">Asistencia</h1>
        </Link>
    </Block>
    <Block className="min-h-[100px] cursor-not-allowed flex items-center justify-center col-span-6 md:col-span-3 border-white border-2 bg-blue-800 backdrop-blur-lg">
    <Link href="#" className="cursor-not-allowed  place-items-center force-center">
        <HiOutlineViewGrid className="text-5xl" />
        <h1 className="text-xl text-white">Almacén</h1>
    </Link>
    </Block>
    <Block className="min-h-[100px] cursor-not-allowed flex items-center justify-center col-span-6 md:col-span-3 border-white border-2 bg-blue-800 backdrop-blur-lg">
        <Link href="#" className="cursor-not-allowed  place-items-center force-center">
            <HiOutlineClipboardCheck className="text-5xl" />
            <div className="text-xl">Requerimientos</div>
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
