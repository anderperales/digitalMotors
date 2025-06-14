import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Si el usuario no está autenticado, redirige al login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Solo permite acceso si hay token
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/productos",
    "/productos/:path*",
    "/sedes",
    "/sedes/:path*",
    "/cuaderno-de-obra/:path*",
    "/asistencia/:path*",
    "/almacen/:path*",
    "/configuracion-producto",
    "/configuracion-producto/:path*",
    "/trabajadores",
    "/trabajadores/:path*",
  ],
};
