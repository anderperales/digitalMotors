"use client";
import React from 'react';
import Image from 'next/image';
import { handleButtonClick } from './whatsappUtils';

const FooterV2: React.FC = () => {


  return (
    <footer className="footer mb-2 w-full text-white mt-24 md:mt-0  sm:mt-60">
      <div className="footer-container flex justify-between items-center p-4">
        
        <div className="flex-grow text-center">
          <p className="footer-p">
            All rights reserved ©
            <span className="text-white"> Digital Motors</span>
          </p>
        </div>
        <button className="fixed bottom-20 right-2 md:bottom-6 md:right-6  bg-blue-800  p-4 rounded-full border-white border-2 text-white items-center md:flex transition-transform transform hover:scale-105 active:scale-95"
        onClick={() => handleButtonClick("+51967203938", "Hola, tengo una consulta")}>
          <span className='font-bold'> ¿Tienes dudas?</span>
          <Image className='absolute -mt-12 -ml-20 transition-transform transform hover:scale-105 active:scale-95  animate-bounce' src="/bot.png" width={100} height={100} alt="contacto" />
        </button>
      </div>
    </footer>
  );
};


export default FooterV2;
