import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

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

    const almacens = await prisma.almacen.findMany();

    if (!almacens || almacens.length === 0) {
      return NextResponse.json({
        message: "No hay almacenes",
      }, {
        status: 404,
      });
    }

    return NextResponse.json(almacens);
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
  try {
    const { nombre, direccion } = await request.json();
    const newAlmacen = await prisma.almacen.create({
      data: {
        nombre,
        direccion
      },
    });
    return NextResponse.json(newAlmacen, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}