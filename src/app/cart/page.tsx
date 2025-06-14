"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const telefono = "51907059048";
  const mensaje = cart.length
    ? `Hola, quisiera cotizar los siguientes productos:\n\n` +
      cart
        .map(
          (item) =>
            `- ${item.name} (${item.quantity} unidad${item.quantity > 1 ? "es" : ""})`
        )
        .join("\n")
    : "Hola, deseo hacer una consulta.";

  const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  if (!cart) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-red-950 py-12 px-6 text-white">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 backdrop-blur rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Carrito de Cotización</h1>

        {cart.length === 0 ? (
          <p className="text-gray-300">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="divide-y divide-white/10">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{item.name}</h2>
                    <p className="text-sm text-gray-400">{item.brand.name}</p>
                    <p className="text-sm text-gray-400">{item.category.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="text-white">{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-sm text-gray-300 hover:underline"
              >
                Vaciar carrito
              </button>
              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
              >
                Enviar por WhatsApp
              </a>
            </div>
          </>
        )}

        <div className="mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition"
          >
            ← Seguir explorando productos
          </Link>
        </div>
      </div>
    </div>
  );
}
