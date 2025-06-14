import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { Prisma } from "@prisma/client";

// Método GET para obtener todos los productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        unit: true,
        files: true,
      },
    });

    const formattedProducts = products.map(({ category, unit, ...product }) => ({
      ...product,
      files: product.files || [],
      category: category?.name || "Sin categoría",
      unit: unit?.name || "Sin unidad",
    }));


    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, files = [], categoryId, unitId } = await request.json();
    const newProduct = await prisma.product.create({
      data: {
        name,
        category: { connect: { id: categoryId } },
        unit: { connect: { id: unitId } },
        files: files.length > 0
          ? {
              create: files.map((file: { url: string; type: string; publicId: string }) => ({
                url: file.url,
                type: file.type,
                publicId: file.publicId,
              })),
            }
          : undefined,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "El producto ya existe. Usa otro nombre." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
