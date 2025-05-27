"use client";

import { createContext, useState, useContext } from "react";
import { Construction } from "@prisma/client";
import { ConstructionWithTrabajadores } from "@/interfaces/Construction";

export const ConstructionContext = createContext<{
  constructions: ConstructionWithTrabajadores[];
  loadConstructions: () => Promise<void>;
}>({
  constructions: [],
  loadConstructions: async () => {},
});

export const useConstructions = () => {
  const context = useContext(ConstructionContext);
  if (!context) {
    throw new Error("useConstructions must be used within a ConstructionsProvider");
  }
  return context;
};

export const ConstructionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [constructions, setConstructions] = useState<ConstructionWithTrabajadores[]>([]);

  async function loadConstructions() {
    const res = await fetch("/api/sedes");
    const data = await res.json();
  
    if (Array.isArray(data)) {
      setConstructions(data); // Solo asignamos si es un array
    } else {
      setConstructions([]); // En caso de error, asignamos un array vacío
    }
  }

  return (
    <ConstructionContext.Provider
      value={{
        constructions,
        loadConstructions,
      }}
    >
      {children}
    </ConstructionContext.Provider>
  );
};
