import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const almacen = await prisma.almacen.findFirst({
      where: {
        id: Number(params.id),
      },
    });

    if (!almacen)
      return NextResponse.json({ message: "almacen not found" }, { status: 404 });

    return NextResponse.json(almacen);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedalmacen = await prisma.almacen.delete({
      where: {
        id: Number(params.id),
      },
    });
    return NextResponse.json(deletedalmacen);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "almacen not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { nombre, direccion } = await request.json();
    const updatedalmacen = await prisma.almacen.update({
      where: {
        id: Number(params.id),
      },
      data: {
        nombre, direccion
      },
    });
    return NextResponse.json(updatedalmacen);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "almacen not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}
