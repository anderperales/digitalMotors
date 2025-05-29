// pages/api/cv.ts
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";

export async function PUT(request: Request) {
    try {
        const { email, cvUrl } = await request.json();

        // Verifica que se proporcionen el email y la URL del CV
        if (!email || !cvUrl) {
            return NextResponse.json(
                { message: 'Email y URL del CV son requeridos.' },
                { status: 400 }
            );
        }

        // Actualiza la URL del CV en la base de datos
        const updatedUser = await prisma.user.update({
            where: { email },
            data: { cvUrl },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json(
                    { message: 'Usuario no encontrado.' },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { message: error.message },
                { status: 500 }
            );
        }

        // Manejo de errores genéricos
        return NextResponse.json(
            { message: 'Error inesperado al actualizar el CV.' },
            { status: 500 }
        );
    }
}
