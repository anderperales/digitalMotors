import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/libs/prisma";

export async function POST() {
  try {
    // 1. Eliminar todos los productos
    await prisma.product.deleteMany({});

    // 2. Resetear el autoincremento (esto es específico de algunas bases de datos como PostgreSQL)
    await prisma.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1;`;

    // 3. Leer el archivo almacen_db.json
    const filePath = path.join(process.cwd(), "public", "almacen_db.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { mockProducts } = JSON.parse(fileContent);

    // 4. Procesar cada producto
    const skippedProducts: string[] = []; // Para almacenar los productos que no se insertan
    for (const product of mockProducts) {
      const { name, category, unit } = product;

      // Buscar ID de categoría
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category.toUpperCase() },
      });

      // Buscar ID de unidad
      const unitRecord = await prisma.unit.findFirst({
        where: { name: unit.toUpperCase() },
      });

      if (!categoryRecord || !unitRecord) {
        console.warn(`No se encontró categoría o unidad para ${name}`);
        skippedProducts.push(name); // Agregar el nombre del producto a la lista de saltados
        continue; // Saltar este producto
      }

      // Crear el producto
      await prisma.product.create({
        data: {
          name,
          category: { connect: { id: categoryRecord.id } },
          unit: { connect: { id: unitRecord.id } },
        },
      });
    }

    // 5. Reportar productos no insertados
    if (skippedProducts.length > 0) {
      console.log("Productos no insertados:");
      skippedProducts.forEach((product) => console.log(product));
    }

    return NextResponse.json({ message: "Productos insertados correctamente" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error cargando productos" }, { status: 500 });
  }
}
