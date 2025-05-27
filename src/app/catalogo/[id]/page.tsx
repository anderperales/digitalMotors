"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaWhatsapp, FaCartPlus } from "react-icons/fa";

interface Producto {
  id: number;
  name: string;
  files: { id: number; url: string }[];
  category: { name: string };
  unit: { name: string };
}

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducto = async () => {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setProducto(data);
    };
    fetchProducto();
  }, [id]);

  if (!producto) return <p className="text-center py-10">Cargando producto...</p>;

  const whatsappNumber = "51987654321";
  const whatsappMessage = `Hola, estoy interesado en el producto: ${producto.name}`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto mb-6">
        <Link
          href="/catalogo"
          className="inline-block text-blue-800 hover:text-blue-900 font-medium hover:underline transition"
        >
          ← Volver al catálogo
        </Link>
      </div>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Imágenes */}
          <div className="overflow-x-auto whitespace-nowrap flex gap-4">
            {producto.files.map((file) => (
              <img
                key={file.id}
                src={file.url}
                alt={`Producto ${producto.name}`}
                className="h-64 w-auto object-cover rounded shadow-sm"
              />
            ))}
          </div>

          {/* Detalles */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-blue-800">{producto.name}</h1>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Categoría:</span> {producto.category.name}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Unidad:</span> {producto.unit.name}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => addToCart(producto)}
                className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition w-full justify-center"
              >
                <FaCartPlus className="mr-2" />
                Agregar al carrito
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition w-full justify-center"
              >
                <FaWhatsapp className="mr-2" />
                Consultar por WhatsApp
              </a>

              <p className="text-sm text-gray-400 mt-4">ID: {producto.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
