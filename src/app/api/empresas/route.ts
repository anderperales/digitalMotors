import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
      const userCompanies = await prisma.company.findMany({
        where: {
          users: {
            some: { id: userId }, // Filtrar por sedes que tengan asignado al usuario
          },
        },
      });
  
      if (!userCompanies || userCompanies.length === 0) {
        return NextResponse.json({
          message: "Este usuario no pertenere a una empresa",
        }, {
          status: 404,
        });
      }
  
      // Retornar las construcciones del usuario
      return NextResponse.json(userCompanies);
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
  
