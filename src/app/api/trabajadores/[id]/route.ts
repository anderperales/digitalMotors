import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const persona = await prisma.persona.findUnique({
      where: { id: Number(params.id) },
      include: {
        trabajador: {
          include: {
            cargo: true,
            construction: true,
          },
        },
      },
    });

    if (!persona) {
      return NextResponse.json(
        { message: "Persona no encontrada" },
        { status: 404 }
      );
    }

    // Extraer datos del trabajador si existen
    const trabajador = persona.trabajador;

    const formattedPersona = {
      id: persona.id,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      celular: persona.celular,
      direccion: persona.direccion,
      email: persona.email,
      constructionId: trabajador?.construction?.id || null,
      idCargo: trabajador?.cargo?.id || null,
    };

    return NextResponse.json(formattedPersona);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const personaId = Number(params.id);

    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
      include: { trabajador: true },
    });

    if (!persona) {
      return NextResponse.json(
        { message: "Persona no encontrada" },
        { status: 404 }
      );
    }

    if (persona.trabajador) {
      await prisma.trabajador.delete({ where: { personaId } });
    }

    const deletedPersona = await prisma.persona.delete({ where: { id: personaId } });

    return NextResponse.json({ message: "Persona eliminada correctamente", deletedPersona });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Persona no encontrada" }, { status: 404 });
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const personaId = Number(params.id);
    const { nombres, apellidos, celular, direccion, email, constructionId, idCargo } = await request.json();

    // Verificar si la persona existe
    const persona = await prisma.persona.findUnique({
      where: { id: personaId },
      include: { trabajador: true },
    });

    if (!persona) {
      return NextResponse.json({ message: "Persona no encontrada" }, { status: 404 });
    }

    // Validar email duplicado
    if (email) {
      const emailExists = await prisma.persona.findUnique({ where: { email } });
      if (emailExists && emailExists.id !== personaId) {
        return NextResponse.json({ message: "El email ya está en uso por otra persona" }, { status: 400 });
      }
    }

    // Actualizar persona
    const updatedPersona = await prisma.persona.update({
      where: { id: personaId },
      data: { nombres, apellidos, celular, direccion, email },
    });

    let updatedTrabajador = null;

    // Si la persona es un trabajador, actualizar cargo y/o proyecto
    if (persona.trabajador) {
      updatedTrabajador = await prisma.trabajador.update({
        where: { personaId: personaId },
        data: {
          cargoId: idCargo !== undefined ? idCargo : persona.trabajador.cargoId,
          constructionId: constructionId !== undefined ? constructionId : persona.trabajador.constructionId,
        },
        include: { cargo: true, construction: true },
      });
    }

    // Formatear respuesta
    const formattedPersona = {
      id: updatedPersona.id,
      nombres: updatedPersona.nombres,
      apellidos: updatedPersona.apellidos,
      celular: updatedPersona.celular,
      direccion: updatedPersona.direccion,
      email: updatedPersona.email,
      constructionId: updatedTrabajador?.construction?.id || null,
      idCargo: updatedTrabajador?.cargo?.id || null,
    };

    return NextResponse.json(formattedPersona);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Persona no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 });
  }
}
