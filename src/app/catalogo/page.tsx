"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaCartPlus } from "react-icons/fa";

interface Producto {
  id: number;
  name: string;
  category: string;
  unit: string;
  files: { url: string }[];
}

export default function CatalogPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState<string>("Todos");
  const [search, setSearch] = useState<string>("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("http://localhost:3000/api/productos");
      const data = await res.json();
      setProductos(data);
      setFiltered(data);
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    let result = [...productos];

    if (categoria !== "Todos") {
      result = result.filter((p) => p.category === categoria);
    }

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [categoria, search, productos]);

  const categorias = ["Todos", ...Array.from(new Set(productos.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Catálogo de Productos</h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded shadow-sm"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 container mx-auto">
        {filtered.map((producto) => (
          <div
            key={producto.id}
            className="group bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl border flex flex-col justify-between"
          >
            <Link href={`/catalogo/${producto.id}`}>
              <div className="overflow-hidden">
                <img
                  src={producto.files?.[0]?.url || "/placeholder.png"}
                  alt={producto.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <span className="inline-block text-xs font-medium text-white bg-bramotors-red px-2 py-1 rounded mb-2">
                  {producto.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 h-12">{producto.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Unidad: {producto.unit}</p>
              </div>
            </Link>
            <div className="p-4 pt-0">
              <button
                onClick={() => addToCart({
    ...producto,
    category: { name: producto.category },
    unit: { name: producto.unit },
  })
}
                className="flex items-center justify-center gap-2 bg-bramotors-red text-white px-4 py-2 rounded hover:bg-blue-900 transition text-sm w-full"
              >
                <FaCartPlus />
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No se encontraron productos.</p>
      )}
    </div>
  );
}
