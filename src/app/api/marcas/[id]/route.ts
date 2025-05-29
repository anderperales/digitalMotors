import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const unit = await prisma.brand.findFirst({
      where: {
        id: Number(params.id),
      },
    });

    if (!unit)
      return NextResponse.json({ message: "unit not found" }, { status: 404 });

    return NextResponse.json(unit);
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
    const deletedunit = await prisma.brand.delete({
      where: {
        id: Number(params.id),
      },
    });
    return NextResponse.json(deletedunit);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "unit not found" },
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
    const { name } = await request.json();
    const updatedunit = await prisma.brand.update({
      where: {
        id: Number(params.id),
      },
      data: {
        name
      },
    });
    return NextResponse.json(updatedunit);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "unit not found" },
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
