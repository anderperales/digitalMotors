import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Método GET: Lista todas las asistencias
export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        user: true, // Incluye datos del usuario
        construction: true, // Incluye datos de la proyecto
      },
    });

    // Ordenar por fecha (más recientes primero)
    const formattedAttendances = attendances.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(formattedAttendances);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
  }
}
// Método POST: Crea una nueva asistencia
export async function POST(request: Request) {
  try {
    const { userId, constructionId, status, notes, latitude, longitude } = await request.json();

    if (!userId || !constructionId || status === undefined) {
      return NextResponse.json(
        { message: "Datos incompletos. Asegúrate de enviar userId, constructionId y status." },
        { status: 400 }
      );
    }

    // Obtener fecha actual (solo día, mes, año)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Contar asistencias del usuario para el día actual
    const attendanceCount = await prisma.attendance.count({
      where: {
        userId,
        createdAt: {
          gte: today, // Desde el inicio del día actual
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Hasta el final del día
        },
      },
    });

    if (attendanceCount >= 2) {
      return NextResponse.json(
        { message: "No puedes marcar asistencia más de dos veces al día." },
        { status: 400 }
      );
    }

    // Crear nueva asistencia si no excede el límite
    const newAttendance = await prisma.attendance.create({
      data: {
        user: { connect: { id: userId } },
        construction: { connect: { id: constructionId } },
        status,
        notes: notes || null,
        latitude: latitude || null,
        longitude: longitude || null,
      },
    });

    return NextResponse.json(newAttendance);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
