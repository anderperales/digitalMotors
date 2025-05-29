"use client";
import React from "react";
import { FiTool } from "react-icons/fi";
import { HiBookOpen, HiBriefcase } from "react-icons/hi";
import { handleButtonClick } from "./whatsappUtils";

const Services: React.FC = () => {

  return (
    <section className="py-36 px-4 md:mt-0 mt-36 bg-blue-800">
        <div className="pb-24 w-full flex flex-col items-center  space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
            Todo en un solo lugar</h2>
            <p className="text-white font-bold text-xl md:text-2xl text-center ">
                Encuentra cursos especializados y herramientas digitales para destacar en el mundo laboral
            </p>
        </div>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            key={1}
            className="cursor-pointer py-8  bg-white rounded-3xl w-full overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="justify-center items-center flex flex-col">
              <HiBookOpen className="text-blue-800 text-9xl"></HiBookOpen>
            </div>
            <div className="flex flex-col mt-4">
              <h1 className="text-black text-lg md:text-xl lg:text-2xl font-bold text-center">
                Aprende 24/7
              </h1>
              <p className="text-black px-8 text-sm md:text-lg lg:text-lg max-w-full text-center mx-auto mt-2">
                Descripcion
              </p>
            </div>
          </div>
          <div
            key={2}
            className="cursor-pointer  py-8  bg-white rounded-3xl w-full overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="justify-center items-center flex flex-col">
            <FiTool className="text-blue-800 text-9xl"></FiTool>
            </div>
            <div className="flex flex-col mt-4">
                <h1 className="text-black text-lg md:text-xl lg:text-2xl font-bold text-center">
                Herramientas Digitales
                </h1>
                <p className="text-black px-8 text-sm md:text-lg lg:text-lg max-w-full text-center mx-auto mt-2">
                Descripcion
                </p>
            </div>
          </div>
          <div
            key={3}
            className="cursor-pointer bg-white  py-8 rounded-3xl w-full overflow-hidden transform transition-transform duration-300 ease-in-out hover:scale-105"
          >
          <div className="justify-center items-center flex flex-col">
              <HiBriefcase className="text-blue-800 text-9xl"></HiBriefcase>
            </div>
            <div className="flex flex-col mt-4">
              <h1 className="text-black text-lg md:text-xl lg:text-2xl font-bold text-center">
                Ofertas Laborales
              </h1>
              <p className="text-black px-8 text-sm md:text-lg lg:text-lg max-w-full text-center mx-auto mt-2">
                Descripcion
              </p>
            </div>
          </div>
        </div>
        <div className="pt-24 w-full flex flex-col items-center  space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center ">
            ¿Te quedaron dudas?</h2>
            <p className="text-white font-bold text-xl md:text-2xl text-center ">
                ¡Conversa con un asesor especializado!
            </p>
            <button className="bg-white text-black font-bold py-3 px-6 rounded-full  transition-transform transform hover:scale-105 active:scale-95"
            onClick={() => handleButtonClick("+51967203938", "Hola, me gustaría saber más sobre otro servicio")}
            >
                EMPECEMOS YA!
            </button>
        </div>
    </section>
    
  );
};

export default Services;
