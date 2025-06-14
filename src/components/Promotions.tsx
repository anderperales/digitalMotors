import { FaTag } from 'react-icons/fa';
import Link from 'next/link';

export default function Promotions() {
  const promos = [
    {
      title: "¡Solo esta semana! Mantenimiento dominical",
      desc: "10% de descuento en mantenimiento correctivo. ¡Cupos limitados!",
      date: "Disponible hasta el domingo",
    },
    {
      title: "Escaneo vehicular completo GRATIS",
      desc: "Diagnóstico electrónico sin costo en tu primera visita. ¡Reserva hoy!",
      date: "Promoción válida por tiempo limitado",
    },
  ];

  return (
    <section
      id="promotions"
      className="py-20 px-6  text-white"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Promociones Especiales
        </h2>

        <div className="space-y-6">
          {promos.map((promo, i) => (
            <div
              key={i}
              className="relative p-6 pl-14 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/10 shadow-md hover:shadow-lg transition"
            >
              <div className="absolute left-4 top-6 text-bramotors-red text-xl">
                <FaTag />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">{promo.title}</h3>
              <p className="text-sm text-gray-200 mb-2">{promo.desc}</p>
              
              <span className="inline-block mb-4 px-3 py-1 bg-yellow-300 text-black text-xs font-bold rounded-full shadow-sm">
                {promo.date}
              </span><br></br>

              <Link
                href="#contact"
                className="inline-block px-4 py-2 bg-white text-bramotors-red text-sm font-semibold rounded-full hover:bg-gray-200 transition"
              >
                Agenda tu cita
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
