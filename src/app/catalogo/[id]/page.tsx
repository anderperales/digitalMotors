"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp, FaCartPlus } from "react-icons/fa";
import Loader from "@/components/Loader";

interface Producto {
  id: number;
  name: string;
  files: { id: number; url: string }[];
  category: { name: string };
  brand: { name: string };
  unit: { name: string };
}

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      const res = await fetch(`/api/productos/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setProducto(data);
    };
    fetchProducto();
  }, [id]);

  if (!producto) return (
  
    <div className="min-h-screen bg-gradient-to-br from-black/90 via-black to-red-950 py-12 px-6 text-white">
      <Loader />;
    </div>
    )

  const whatsappNumber = "51987654321";
  const whatsappMessage = `Hola, estoy interesado en el producto: ${producto.name}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 via-black to-red-950 py-12 px-6 text-white">
      <div className="max-w-5xl mx-auto mb-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition"
        >
          ← Volver al catálogo
        </Link>

      </div>

      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 backdrop-blur rounded-lg shadow-lg p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="overflow-x-auto whitespace-nowrap flex gap-4">
            {producto.files.map((file) => (
              <img
                key={file.id}
                src={file.url}
                alt={`Producto ${producto.name}`}
                className="h-64 w-auto object-cover rounded shadow"
              />
            ))}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4 text-white">{producto.name}</h1>
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">Marca:</span> {producto.brand.name}
              </p>
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">Categoría:</span> {producto.category.name}
              </p>
              <p className="text-sm text-gray-300 mb-6">
                <span className="font-semibold text-white">Unidad:</span> {producto.unit.name}
              </p>
              <p className="text-sm text-gray-300 mb-6">
                ID: {producto.id}</p>

            </div>

            <div className="space-y-4">
              <button
                onClick={() => addToCart(producto)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-bramotors-red text-white rounded-full hover:bg-red-600 transition w-full font-semibold"
              >
                <FaCartPlus />
                Agregar al carrito
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition w-full font-semibold"
              >
                <FaWhatsapp />
                Consultar por WhatsApp
              </a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
