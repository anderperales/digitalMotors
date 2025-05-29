import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener la sesión del usuario autenticado
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Usuario no autenticado" }, { status: 401 });
    }

    const constructionId = Number(params.id);
    if (isNaN(constructionId)) {
      return NextResponse.json({ message: "ID de construcción no válido" }, { status: 400 });
    }

    // Obtener trabajadores de la construcción
    const trabajadores = await prisma.trabajador.findMany({
      where: { constructionId },
      include: {
        persona: true,
        cargo: true,
      },
    });

    if (!trabajadores.length) {
      return NextResponse.json({ message: "No hay trabajadores en esta construcción" }, { status: 404 });
    }

    const formattedTrabajadores = trabajadores.map((trabajador) => ({
      ...trabajador,
      nombres: trabajador.persona.nombres+" "+trabajador.persona.apellidos,
    }));

    return NextResponse.json(formattedTrabajadores);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
