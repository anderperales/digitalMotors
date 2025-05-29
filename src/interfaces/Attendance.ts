import { Attendance, User, Construction } from "@prisma/client";

export type AttendanceWithUser = Attendance & {
  user?: User | null; // user puede ser null o no existir
  construction?: Construction | null; // construction puede ser null o no existir
};

export type CreateAttendance = Omit<Attendance, "id" | "createdAt" | "updatedAt" | "user" | "construction">;
