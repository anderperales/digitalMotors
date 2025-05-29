"use client";

import { createContext, useState, useContext } from "react";
import { Product } from "@prisma/client";

// Definición del contexto para el modelo Product
export const ProductContext = createContext<{
  products: Product[];
  loadProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, "id">) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  updateProduct: (id: number, product: Omit<Product, "id">) => Promise<void>;
}>({
  products: [],
  loadProducts: async () => {},
  createProduct: async (product) => {},
  deleteProduct: async (id) => {},
  selectedProduct: null,
  setSelectedProduct: (product) => {},
  updateProduct: async (id, product) => {},
});

// Hook para usar el contexto de productos
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

// Proveedor del contexto de productos
export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }

  async function createProduct(product: Omit<Product, "id">) {
    const res = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newProduct = await res.json();
    setProducts([...products, newProduct]);
  }

  async function deleteProduct(id: number) {
    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    setProducts(products.filter((product) => product.id !== id));
  }

  async function updateProduct(id: number, product: Omit<Product, "id">) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedProduct = await res.json();
    setProducts(products.map((p) => (p.id === id ? updatedProduct : p)));
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loadProducts,
        createProduct,
        deleteProduct,
        selectedProduct,
        setSelectedProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
