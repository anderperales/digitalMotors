"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaCartPlus } from "react-icons/fa";
import Image from "next/image";

interface Producto {
  id: number;
  name: string;
  category: string;
  brand: string;
  unit: string;
  files: { url: string }[];
}

export default function CatalogPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtered, setFiltered] = useState<Producto[]>([]);
  const [categoria, setCategoria] = useState<string>("Todos");
  const [marca, setMarca] = useState<string>("Todas");
  const [search, setSearch] = useState<string>("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("/api/productos");
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

    if (marca !== "Todas") {
      result = result.filter((p) => p.brand === marca);
    }

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [categoria, marca, search, productos]);

  const categorias = ["Todos", ...Array.from(new Set(productos.map(p => p.category)))];
  const marcas = ["Todas", ...Array.from(new Set(productos.map(p => p.brand)))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/80 via-black to-red-950 py-12 px-6 text-white">
      <Link
          href="/"
          className="fixed top-6 left-6 inline-flex items-center gap-2 h-6 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition"
        >
          ← Volver
        </Link>
      <div className="col-span-12 flex justify-center">
        <Link href="/">
        <Image
          src="/logo.svg"
          width={200}
          height={100}
          alt="Logo Digital Motors"
          className="mb-4 rounded-lg"
        />
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 max-w-6xl mx-auto">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded border-none shadow focus:ring-2 focus:ring-red-500 text-black"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded shadow text-black"
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded shadow text-black"
        >
          {marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Productos */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 container mx-auto">
        {filtered.map((producto) => (
          <div
            key={producto.id}
            className="group bg-white/5 rounded-xl shadow-md overflow-hidden border border-white/10 hover:shadow-xl transition flex flex-col justify-between backdrop-blur-sm"
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
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs font-medium  px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition">
                    {producto.category}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition">
                    {producto.brand}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1 line-clamp-2 h-12 text-white">{producto.name}</h3>
                <p className="text-sm text-gray-300">Unidad: {producto.unit}</p>
              </div>
            </Link>
            <div className="p-4 pt-0">
              <button
                onClick={() =>
                  addToCart({
                    ...producto,
                    category: { name: producto.category },
                    unit: { name: producto.unit },
                    brand: { name: producto.brand },
                  })
                }
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition w-full "
              >
                <FaCartPlus />
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-300 mt-10">
          No se encontraron productos.
        </p>
      )}
    </div>
  );
}
