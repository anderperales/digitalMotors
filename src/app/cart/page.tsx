"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const telefono = "51973531213"; // Tu número real
  const mensaje = cart.length
    ? `Hola, quisiera cotizar los siguientes productos:\n\n` +
      cart
        .map(
          (item) =>
            `- ${item.name} (${item.quantity} unidad${
              item.quantity > 1 ? "es" : ""
            })`
        )
        .join("\n")
    : "Hola, deseo hacer una consulta.";

  const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          Carrito de Cotización
        </h1>

        {cart.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="divide-y">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <p className="text-sm text-gray-500">
                      {item.category.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-sm text-gray-600 hover:underline"
              >
                Vaciar carrito
              </button>
              <a
                href={urlWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Enviar cotización por WhatsApp
              </a>
            </div>
          </>
        )}

        <div className="mt-6">
          <Link href="/catalogo" className="text-blue-800 hover:underline text-sm">
            ← Seguir explorando productos
          </Link>
        </div>
      </div>
    </div>
  );
}
