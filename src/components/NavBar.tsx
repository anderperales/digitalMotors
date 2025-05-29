"use client"
import { Avatar, Dropdown } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function NavBar({ updateIsAuthenticated }: { updateIsAuthenticated: (isAuthenticated: boolean) => void }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user; // Booleano que indica si el usuario está autenticado
  const name = session?.user?.persona?.nombres || ''; // Obtiene el nombre del usuario de la sesión
  const lastName = session?.user?.persona?.apellidos || ''; // Obtiene el nombre del usuario de la sesión
  const email = session?.user?.email || ''; // Obtiene el correo del usuario de la sesión
  const currentPath = usePathname(); // Obtiene la ruta actual

  // Actualiza el estado en RootLayout solo cuando isAuthenticated cambia
  useEffect(() => {
    updateIsAuthenticated(isAuthenticated);
  }, [isAuthenticated, updateIsAuthenticated]);

  // Verifica que no esté en las rutas de login o register
  const isLoginOrRegisterPage = currentPath === "/auth/login" || currentPath === "/auth/register" || currentPath === "/";

  return (
    <>
      {
        isAuthenticated && !isLoginOrRegisterPage ? (
          <div className="flex w-full justify-end max-h-3 h-3 items-center p-5 bg-blue-800">
            <Dropdown
              arrowIcon={false}
              inline
              label={<Avatar alt="User settings" img="/default_pfp.png" rounded />}
            >
              <Dropdown.Header>
                <span className="block text-sm">{name+" "+lastName}</span>
                <span className="block truncate text-sm font-medium">{email}</span>
              </Dropdown.Header>
              <Dropdown.Item as={Link} href="/dashboard">Inicio</Dropdown.Item>
              {/* <Dropdown.Item as={Link} href="/ajustes">Ajustes</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => signOut()}>Salir</Dropdown.Item>
            </Dropdown>
          </div>
        ) : null
      }
    </>
  );
}

export default NavBar;
