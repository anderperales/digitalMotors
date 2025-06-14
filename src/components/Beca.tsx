"use client";
import React from "react";
import { handleButtonClick } from "./whatsappUtils";

const Beca: React.FC = () => {

  return (
    <section className="py-12 px-4">

        <div className="py-12 w-full flex flex-col items-center  space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-black text-center">
            ¿Eres estudiante?</h2>
            <p className="text-black font-bold text-xl md:text-2xl text-center ">
                En Terra nos esforzamos día a día en mejorar y compartir el conocimiento a los profesionales del futuro
            </p>
            <button className="bg-bramotors-red text-white font-bold py-3 px-6 rounded-full  transition-transform transform hover:scale-105 active:scale-95"
            onClick={() => handleButtonClick("+51967203938", "Hola, me gustaría saber más sobre otro servicio")}
            >
                ACCEDE A UNA BECA DEL 70% AQUÍ
            </button>
        </div>
    </section>
    
  );
};

export default Beca;
