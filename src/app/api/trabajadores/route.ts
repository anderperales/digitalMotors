import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const trabajadores = await prisma.trabajador.findMany({
      include: {
        persona: true, // Datos de la persona
        cargo: true,   // Información del cargo
        construction: true, // Información de la obra
      },
    });

    if (trabajadores.length === 0) {
      return NextResponse.json(
        { message: "No hay trabajadores registrados" },
        { status: 404 }
      );
    }

    // Formatear la respuesta con constructionId en lugar de companyId
    const formattedTrabajadores = trabajadores.map(trabajador => ({
      id: trabajador.persona.id,
      nombres: trabajador.persona.nombres,
      apellidos: trabajador.persona.apellidos,
      celular: trabajador.persona.celular,
      direccion: trabajador.persona.direccion,
      email: trabajador.persona.email,
      constructionId: trabajador.construction?.id || null, // Aquí se usa construction.id como constructionId
      idCargo: trabajador.cargo?.id || null,
    }));

    return NextResponse.json(formattedTrabajadores);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { nombres, apellidos, celular, direccion, email, idCargo, constructionId } =
      await request.json();

    // Verificar si el cargo existe
    const cargo = await prisma.cargo.findUnique({ where: { id: idCargo } });
    if (!cargo) {
      return NextResponse.json(
        { message: "El cargo especificado no existe" },
        { status: 400 }
      );
    }

    // Verificar si el proyecto (construction) existe
    const construction = await prisma.construction.findUnique({ where: { id: constructionId } });
    if (!construction) {
      return NextResponse.json(
        { message: "El proyecto especificado no existe" },
        { status: 400 }
      );
    }

    // Verificar si la persona ya existe (según el email)
    let persona = await prisma.persona.findUnique({ where: { email } });

    if (!persona) {
      // Si no existe, crearla
      persona = await prisma.persona.create({
        data: {
          nombres,
          apellidos,
          celular,
          direccion,
          email,
        },
      });
    }

    // Verificar si la persona ya está asociada a un trabajador
    const trabajadorExistente = await prisma.trabajador.findUnique({
      where: { personaId: persona.id },
    });

    if (trabajadorExistente) {
      return NextResponse.json(
        { message: "Esta persona ya está registrada como trabajador" },
        { status: 400 }
      );
    }

    // Crear el trabajador y asociarlo con persona, cargo y proyecto
    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        personaId: persona.id,
        cargoId: idCargo,
        constructionId: constructionId, // Se usa constructionId en lugar de idConstruction
      },
      include: {
        persona: true,
        cargo: true,
        construction: true,
      },
    });

    return NextResponse.json(nuevoTrabajador, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Prisma.PrismaClientKnownRequestError ? error.message : "Error desconocido" }, { status: 500 });
  }
}
