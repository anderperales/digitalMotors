import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { Prisma } from "@prisma/client";

interface Params {
    params: { id: string };
  }

export async function GET(request: Request, { params }: Params) {
  try {
    const movimientos = await prisma.movimientoAlmacen.findMany({
     where: {
        constructionId: Number(params.id),
        },
      orderBy: {
        createdAt: "desc", // Ordenar por fecha de creación (más reciente primero)
      },
      include: {
        producto: { 
          select: { 
            name: true,
            category: { select: { name: true } }, 
            unit: { select: { name: true } } 
          } 
        },
        solicitante: { select: { persona: { select: { nombres: true, apellidos: true } } } },
        responsable: { select: { persona: { select: { nombres: true, apellidos: true } } } },
        construction: { select: { id: true } },
      },
    });

    
    if (!movimientos)
        return NextResponse.json({ message: "Kardex not found" }, { status: 404 });

    const formattedMovimientos = movimientos.map(
      ({ id, producto, solicitante, responsable, construction, ...mov }) => ({
        id,
        producto: producto?.name || "Sin producto",
        categoria: producto?.category?.name || "Sin categoría",
        unidad: producto?.unit?.name || "Sin unidad",
        cantidad: mov.cantidad,
        createdAt: mov.createdAt,
        updatedAt: mov.updatedAt,
        tipo: mov.cantidad >= 0 ? "Entrada" : "Salida",
        detalle: {unidad: producto?.unit?.name, cantidad: mov.cantidad},
        solicitante: (solicitante?.persona?.nombres + " " + solicitante?.persona?.apellidos) || "Sin solicitante",
        responsable: (responsable?.persona?.nombres + " " + responsable?.persona?.apellidos) || "Sin responsable",
        construction: construction?.id || "Sin obra",
      })
    );

    return NextResponse.json(formattedMovimientos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving movimientos" },
      { status: 500 }
    );
  }
}

