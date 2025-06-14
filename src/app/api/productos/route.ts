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
        brand: true,
      },
    });

    // Limpiar código redundante y dar formato coherente
    const formattedProducts = products.map((product) => ({
      ...product,
      files: product.files || [],
      category: product.category?.name || "Sin categoría",
      unit: product.unit?.name || "Sin unidad",
      brand: product.brand?.name || "Sin unidad",
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
    const { name,
      purchasePrice,
      salePrice,
      color,
      brand,
      weight,
      size,
      condition = "new",
      year,
      notes,
      files = [], categoryId, unitId, brandId } = await request.json();

        const purchasePriceFloat = purchasePrice === "" ? null : parseFloat(purchasePrice);
        const salePriceFloat = salePrice === "" ? null : parseFloat(salePrice);
        const weightFloat = weight === "" ? null : parseFloat(weight);
        const yearInt = year === "" ? null : parseInt(year, 10);


    if (!name || !categoryId || !unitId || !brandId) {
      return NextResponse.json(
        { message: "Faltan datos obligatorios." },
        { status: 400 }
      );
    }
    const newProduct = await prisma.product.create({
      data: {
        name,
        purchasePrice: purchasePriceFloat,
        salePrice: salePriceFloat,
        weight: weightFloat,
        year: yearInt,
        color,
        size,
        condition,
        notes,
        category: { connect: { id: categoryId } },
        unit: { connect: { id: unitId } },
        brand: { connect: { id: brandId } },
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
  console.error("Error en POST /api/productos:", error); // <== aquí el detalle del error
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