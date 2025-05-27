// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    cvUrl?: string; // Aquí defines cvUrl como opcional en User
    cvUpdatedAt?: string; // Aquí defines cvUrl como opcional en User
    type?: internal;
    persona?: Persona;
  }

  interface Session {
    user: User; // Asegúrate de que la sesión tenga un objeto user
  }
}
