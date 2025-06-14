'use client';

import {
  FaTools,
  FaCarCrash,
  FaMicrochip,
} from 'react-icons/fa';

import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

export default function Services() {
  const services = [
    {
      key: 'mantenimiento',
      icon: <FaTools className="text-4xl mb-4 text-bramotors-red" />,
      title: 'Mantenimiento General',
      text: 'Prevención y solución de fallas mecánicas con inspección completa.',
    },
    {
      key: 'frenos',
      icon: <FaCarCrash className="text-4xl mb-4 text-bramotors-red" />,
      title: 'Servicio de Frenos',
      text: 'Revisión, cambio y ajuste de frenos para tu seguridad en carretera.',
    },
    {
      key: 'afinamiento',
      icon: <FaMicrochip className="text-4xl mb-4 text-bramotors-red" />,
      title: 'Afinamiento Electrónico',
      text: 'Diagnóstico computarizado y optimización del rendimiento del motor.',
    },
  ];

  return (
    <section id="services" className="py-20 px-6 text-center  text-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Servicios</h2>
          <p className="text-white">
            Nos especializamos en el cuidado integral de tu vehículo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map(({ key, icon, title, text }) => (
            <div
              key={key}
              className="relative p-6 bg-gradient-to-r from-white/10 to-white/5 border border-white/10 rounded-lg shadow-sm hover:shadow-md transition text-left"
            >
              <a
                href={`#${key}`}
                className="absolute top-4 right-4 text-xs flex gap-2 items-center font-semibold text-bramotors-red hover:underline"
              >
                Leer más
                <FaArrowUpRightFromSquare className="text-xs" />
              </a>

              {icon}
              <h3 className="text-2xl font-semibold mb-2 font-sans">
                {title}
              </h3>
              <p className="text-sm text-white">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
