import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

interface Params {
  params: { id: string };
}

// Obtener producto por ID
export async function GET(request: Request, { params }: Params) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: Number(params.id) },
      include: {
        files: true,
        category: true,
        brand: true,
        unit: true,
      },
    });

    if (!product) {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}

// Eliminar producto por ID
export async function DELETE(request: Request, { params }: Params) {
  try {
    await prisma.product.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}

// Actualizar producto por ID
export async function PUT(request: Request, { params }: Params) {
  try {
    const {
      name,
      categoryId,
      unitId,
      purchasePrice,
      salePrice,
      color,
      brandId,
      weight,
      size,
      condition = "new",
      year,
      notes,
      files,
    } = await request.json();

    const purchasePriceFloat = purchasePrice === "" ? null : parseFloat(purchasePrice);
    const salePriceFloat = salePrice === "" ? null : parseFloat(salePrice);
    const weightFloat = weight === "" ? null : parseFloat(weight);
    const yearInt = year === "" ? null : parseInt(year, 10);


    if (!name || !categoryId || !unitId  || !brandId) {
      return NextResponse.json(
        { message: "Campos obligatorios faltantes: name, categoryId, unitId, brandId" },
        { status: 400 }
      );
    }

    // Construimos el objeto data con control para actualizar todos los campos, aunque sean null o 0
    const dataToUpdate: any = {
      name,
      purchasePrice: purchasePriceFloat,
      salePrice: salePriceFloat,
      weight: weightFloat,
      year: yearInt,
      color: color !== undefined ? color : null,
      size: size !== undefined ? size : null,
      condition,
      notes: notes !== undefined ? notes : null,
      category: { connect: { id: categoryId } },
      unit: { connect: { id: unitId } },
      brand: { connect: { id: brandId } },
    };

    if (files && files.length > 0) {
      dataToUpdate.files = {
        deleteMany: {},
        create: files.map((file: { url: string; type: string; publicId: string }) => ({
          url: file.url,
          type: file.type,
          publicId: file.publicId,
        })),
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(params.id) },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}