"use client";

import { Attendance } from "@prisma/client";
import React, { createContext, useContext, useState } from "react";
import { AttendanceWithUser, CreateAttendance } from "@/interfaces/Attendance";

export const AttendanceContext = createContext<{
  attendances: AttendanceWithUser[]; // Cambiado de `Attendance[]` a `AttendanceWithUser[]`
  loadAttendances: () => Promise<void>;
  createAttendance: (attendance: CreateAttendance) => Promise<void>;
}>({
  attendances: [],
  loadAttendances: async () => {},
  createAttendance: async (attendance: CreateAttendance) => {},
});

export const useAttendances = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendances must be used within a AttendancesProvider");
  }
  return context;
};

export const AttendancesProvider =  ({ children }: { children: React.ReactNode }) => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  async function loadAttendances() {
    const res = await fetch("/api/asistencia");
    const data: AttendanceWithUser[] = await res.json(); // Asegúrate de que data tenga el tipo correcto
    
    if (Array.isArray(data)) {
      setAttendances(data); // Guarda las asistencias que incluyen el usuario y proyecto
    } else {
      setAttendances([]); // Si no es un array, setea el estado vacío
    }
  }
  
  async function createAttendance(attendance: CreateAttendance) {
    const res = await fetch("/api/asistencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendance),
    });
    const newAttendance = await res.json();
    setAttendances([...attendances, { ...newAttendance }]); // Asegurarse de agregar los archivos correctamente
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendances,
        loadAttendances,
        createAttendance
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

