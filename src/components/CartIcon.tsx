"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function CartIcon() {
  const { cart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (total === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 bg-bramotors-red text-white p-3 rounded-full shadow-lg hover:bg-bramotors-red/70 transition z-50 flex items-center justify-center"
      title="Ver carrito"
    >
      <FaShoppingCart className="text-xl" />
      <span className="ml-1 text-sm font-bold">{total}</span>
    </Link>
  );
}
