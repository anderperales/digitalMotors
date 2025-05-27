"use client"
import FooterV2 from "@/components/FooterV2";
import Image from "next/image";
import Link from "next/link";

const productos = [
    {
        id: 1,
        nombre: "Producto 1",
        descripcion: "bidon",
        precio: "$100.00",
        imagen: "/productos/producto1.jpg",
    },
    {
        id: 2,
        nombre: "Producto 2",
        descripcion: "Descripción breve del producto 2.",
        precio: "$150.00",
        imagen: "/productos/producto2.jpg",
    },
    {
        id: 3,
        nombre: "Producto 3",
        descripcion: "Descripción breve del producto 3.",
        precio: "$200.00",
        imagen: "/productos/producto3.jpg",
    },
    {
        id: 4,
        nombre: "Producto 4",
        descripcion: "Descripción breve del producto 4.",
        precio: "$250.00",
        imagen: "/productos/producto4.jpg",
    },
    {
        id: 5,
        nombre: "Producto 5",
        descripcion: "Descripción breve del producto 5.",
        precio: "$250.00",
        imagen: "/productos/producto5.jpg",
    },
];

export default function QR() {
    return (
        <div
            className="min-h-screen flex flex-col items-center bg-cover bg-center"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 128, 0.5)), url('/bg.png')`,
            }}
        >
            {/* Encabezado y botón */}
            <div className="w-full flex flex-col items-center px-4 py-8">
                <Link href={"/"}>
                    <Image
                        src="/logo.svg"
                        width={200}
                        height={100}
                        alt="Logo Digital Motors"
                        className="object-contain"
                        priority
                    />
                </Link>

            </div>

            {/* Lista de productos */}
            <div className="w-full max-w-6xl px-4 pb-10">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Nuestros Productos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <div
  key={producto.id}
  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col w-full md:h-80 h-96"
>
  <div className="relative w-full h-96 md:h-48">
    <Image
      src={producto.imagen}
      alt={producto.nombre}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 25vw"
    />
  </div>
  <div className="p-4 flex-1 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold">{producto.nombre}</h3>
      <p className="text-sm text-gray-600">{producto.descripcion}</p>
    </div>
    <p className="text-blue-600 font-bold mt-2">{producto.precio}</p>
  </div>
</div>

                    ))}
                </div>
            </div>

            {/* Footer */}
            <FooterV2 />
        </div>
    );
}
