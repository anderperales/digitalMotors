import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const category = await prisma.category.findFirst({
      where: {
        id: Number(params.id),
      },
    });

    if (!category)
      return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
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
    const deletedCategory = await prisma.category.delete({
      where: {
        id: Number(params.id),
      },
    });
    return NextResponse.json(deletedCategory);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Category not found" },
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
    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(params.id),
      },
      data: {
        name
      },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Category not found" },
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
