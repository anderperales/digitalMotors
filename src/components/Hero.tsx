'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  FaTools,
  FaOilCan,
  FaCarCrash,
  FaCarBattery,
  FaWrench,
  FaCar,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function Hero() {
  return (
    <section className="w-full  text-white py-32 px-6 font-sans">
      <div className="lg:mt-32 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Bramotors Perú
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Taller automotriz especializado en mantenimiento preventivo, afinamiento electrónico y reparación de motores.
          </p>
          <Link
            href="#services"
            className="inline-block bg-gradient-to-r from-bramotors-red to-red-700 hover:opacity-90 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            Agenda tu cita
          </Link>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/hero_image.png"
            alt="Taller Bramotors"
            width={700}
            height={700}
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-12 md:mt-32 flex flex-wrap justify-center items-center gap-5 md:gap-32">
        {[
          { icon: <FaTools title="Mantenimiento" />, key: 'tools' },
          { icon: <FaOilCan title="Lubricación" />, key: 'oil' },
          { icon: <FaWrench title="Reparación" />, key: 'wrench' },
          { icon: <FaCarCrash title="Frenos" />, key: 'brakes' },
          { icon: <FaCarBattery title="Baterías" />, key: 'battery' },
          { icon: <FaCar title="Escaneo" />, key: 'scan' },
          { icon: <FaMapMarkerAlt title="Trujillo / Piura / Chiclayo" />, key: 'locations' },
        ].map(({ icon, key }) => (
          <div
            key={key}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-bramotors-red bg-white/10 rounded-xl hover:bg-white/20 hover:cursor-pointer transition"
          >
            <div className="text-2xl md:text-3xl">{icon}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
