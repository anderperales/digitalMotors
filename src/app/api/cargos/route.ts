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

    const cargos = await prisma.cargo.findMany();

    if (!cargos || cargos.length === 0) {
      return NextResponse.json({
        message: "No hay cargos",
      }, {
        status: 404,
      });
    }

    return NextResponse.json(cargos);
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