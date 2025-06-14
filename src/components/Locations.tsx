import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

export default function Locations() {
  const places = [
    { city: "Trujillo", phone: "970 369 672" },
    { city: "Piura", phone: "970 718 818" },
    { city: "Chiclayo", phone: "934 396 493" }
  ];

  return (
    <section id="locations" className="py-20 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Nuestros Talleres</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {places.map((p) => (
            <div
              key={p.city}
              className="bg-white/10 hover:bg-white/20 border border-white/10 p-6 rounded-lg shadow-md transition"
            >
              <div className="flex items-center justify-center text-bramotors-red text-3xl mb-4">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-semibold mb-2">{p.city}</h3>
              <div className="flex items-center justify-center gap-2 text-sm">
                <FaPhoneAlt className="text-bramotors-red" />
                <a href={`tel:${p.phone}`} className="hover:underline text-white">
                  {p.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
