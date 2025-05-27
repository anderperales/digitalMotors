import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ruta a tu configuración de NextAuth

export async function GET() {
  try {
    const movimientos = await prisma.movimientoAlmacen.findMany({
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

    const formattedMovimientos = movimientos.map(
      ({ id, producto, solicitante, responsable, construction, ...mov }) => ({
        id,
        producto: producto?.name || "Sin producto",
        categoria: producto?.category?.name || "Sin categoría",
        unidad: producto?.unit?.name || "Sin unidad",
        cantidad: mov.cantidad,
        tipo: mov.cantidad >= 0 ? "Entrada" : "Salida",
        createdAt: mov.createdAt,
        updatedAt: mov.updatedAt,
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



export async function POST(request: Request) {


    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        message: "Usuario no autenticado",
      }, {
        status: 401,
      });
    }

    const userId = session.user.id;
    try {
      const { productId, solicitanteId, cantidad, constructionId } = await request.json();
      console.log(productId);
      const newMovimiento = await prisma.movimientoAlmacen.create({
        data: {
          producto: { connect: { id: productId } },
          solicitante: { connect: { id: solicitanteId } },
          responsable: { connect: { id: userId } },
          cantidad: cantidad,
          construction: { connect: { id: constructionId } },
        },
      });
  
      return NextResponse.json(newMovimiento, { status: 201 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return NextResponse.json(
            { message: "Error de unicidad en algún campo." },
            { status: 400 }
          );
        }
      }
  
      return NextResponse.json(
        { message: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }