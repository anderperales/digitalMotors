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

    const units = await prisma.unit.findMany();

    if (!units || units.length === 0) {
      return NextResponse.json({
        message: "No hay unidades",
      }, {
        status: 404,
      });
    }

    return NextResponse.json(units);
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
    const { name } = await request.json();
    const newProduct = await prisma.unit.create({
      data: {
        name
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}