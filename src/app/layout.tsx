"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Menu from "@/components/Menu";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import CartIcon from "@/components/CartIcon";


const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Digital Motors",
  description:
    "La plataforma Digital Motors tiene como fin potenciar la gestión de autoboutiques",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(pathname.startsWith("/auth")); 

  const handleAuthNavigation = () => {
    updateIsAuthenticated(true); // Actualizar el estado a 'true' para una página de autenticación
  };

  
  const updateIsAuthenticated = (isAuth: boolean) => {
    setIsAuthenticated(isAuth);
  };

  return (
    <html lang="es">
      <head>
        <link rel="preload" as="image" href="/bg_gruas.webp" />
      </head>
      <body className={`bg-gray-100 ${inter.className}`}>
        <SessionProvider>
          <CartProvider>
          <NavBar  updateIsAuthenticated={handleAuthNavigation} />
          <div className="flex flex-col ">
              <Menu></Menu>
              <div>
                {children}
              </div>
            <CartIcon />
            </div>

          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
