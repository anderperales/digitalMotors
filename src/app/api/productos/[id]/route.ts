import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";
interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: Number(params.id),
      },
      include: {
        files: true,
        category: true,
        unit: true
      }
    });

    if (!product)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
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
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(params.id),
      },
      include: {
        files: true,
      },
    });
    return NextResponse.json(deletedProduct);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Product not found" },
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
    const { name, categoryId, files, unitId} = await request.json();
    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(params.id),
      },
      data: {
        name,
        category: { connect: { id: categoryId } },
        unit: { connect: { id: unitId } },
        files: {
          deleteMany: {}, // Borra los archivos existentes
          create: files.map((file: { url: string; type: string; publicId: string; }) => ({
            url: file.url,
            type: file.type,
            publicId: file.publicId,
          })),
        },
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Product not found" },
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
