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
    "/cv/:path*",
    "/bolsa-de-trabajo/:path*",
    "/checkout/:path*",
    "/process_payment/:path*",
    "/sedes/:path*",
    "/cuaderno-de-obra/:path*",
    "/asistencia/:path*",
    "/almacen/:path*",
    "/categorias/:path*",
    "/unidades/:path*",
    "/marcas/:path*",
  ],
};
