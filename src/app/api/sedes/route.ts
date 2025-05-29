import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ruta a tu configuración de NextAuth

export async function GET() {
  try {
    // Obtener la sesión actual del usuario autenticado
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        message: "Usuario no autenticado",
      }, {
        status: 401,
      });
    }

    // Obtener el ID del usuario autenticado
    const userId = session.user.id;

    // Consultar las construcciones asignadas al usuario
    const userConstructions = await prisma.construction.findMany({
      where: {
        users: {
          some: { id: userId }, // Filtrar por sedes que tengan asignado al usuario
        },
      },
      include: {
        trabajadores: {
          include: {
            persona: true,
            cargo: true
          }
        }
      }
    });

    if (!userConstructions || userConstructions.length === 0) {
      return NextResponse.json({
        message: "No hay construcciones asignadas para este usuario",
      }, {
        status: 404,
      });
    }

    // Retornar las construcciones del usuario
    return NextResponse.json(userConstructions);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
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
    const { description, startDate, endDate, address, latitude, longitude, companyId } = await request.json();

    if (!description || !companyId) {
      return NextResponse.json({ message: "Descripción y companyId son obligatorios" }, { status: 400 });
    }

    const newConstruction = await prisma.construction.create({
      data: {
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        address: address || null,
        latitude: latitude || null,
        longitude: longitude || null,
        companyId,
        users: { connect: [{id:userId}] },
        book: { connect: [] },
        attendances: { connect: [] },
      },
    });

    return NextResponse.json(newConstruction, { status: 201 });
  } catch (error) {
    console.error("Error al crear proyecto:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
