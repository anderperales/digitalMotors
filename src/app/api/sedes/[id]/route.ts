import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";


interface Params {
    params: { id: string };
  }
  
  export async function GET(request: Request, { params }: Params) {
    try {
      const construction = await prisma.construction.findFirst({
        where: {
          id: Number(params.id),
        },
      });
  
      if (!construction)
        return NextResponse.json({ message: "Proyecto no encontrado" }, { status: 404 });
  
      return NextResponse.json(construction);
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
      const deletedConstruction = await prisma.construction.delete({
        where: {
          id: Number(params.id),
        },
      });
      return NextResponse.json(deletedConstruction);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Proyecto not found" },
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
      const {description, startDate, endDate, address, latitude, longitude, companyId} = await request.json();
      const updatedConstruction = await prisma.construction.update({
        where: {
          id: Number(params.id),
        },
        data: {
          description,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          address: address || null,
          latitude: latitude || null,
          longitude: longitude || null,
          companyId,
        },
      });
      return NextResponse.json(updatedConstruction);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { message: "Proyecto no encontrado" },
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
  