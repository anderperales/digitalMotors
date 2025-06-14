"use client";

import { Drawer } from "flowbite-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { 
    HiMenu,
    HiOfficeBuilding,
    HiColorSwatch,
    HiCollection,
    HiBookOpen,
    HiTable,
    HiViewGrid,
    HiUserGroup,
    HiCube
} from "react-icons/hi";

function Menu() {
  const { data: session } = useSession();
  const isAuthenticated = session?.user ? true : false; // Verifica si hay un usuario en la sesión

  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el menú desplegable

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false); // Función para cerrar el menú

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Función para abrir/cerrar el menú desplegable

  
  const userId = session?.user?.id ? Number(session.user.id) : undefined;
  const userType = session?.user?.type || '';

  return (
    <>
      {isAuthenticated && (
        <>
          {/* Botón de abrir menú solo visible cuando el Drawer está cerrado */}
          {!isOpen && (
            <button onClick={toggleDrawer} className="p-1 fixed top-1  left-5 z-50 bg-bramotors-black hover:bg-white/20 rounded-xl">
              <HiMenu className="text-white text-2xl "/>
            </button>
          )}
          <Drawer open={isOpen} onClose={closeDrawer}>
            <Drawer.Header title="MENÚ" />
            <div className="flex flex-col p-4">
              {/* <form className="pb-3 md:hidden">
                <TextInput icon={HiDocumentSearch} type="search" placeholder="Buscar" required size={32} />
              </form> */}
              
              <Link href="/dashboard" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiViewGrid className="mr-2" /> Dashboard
              </Link>
              {/* <Link href="/bolsa-de-trabajo" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiBriefcase className="mr-2" /> Ofertas Laborales
              </Link>
              <Link href="/cv" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiClipboard className="mr-2" /> Mi Curriculum
              </Link> */}
              <Link href="/sedes" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiOfficeBuilding className="mr-2" /> Mis Sedes
              </Link>
              <Link href="/trabajadores" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiUserGroup className="mr-2" /> Trabajadores
              </Link>
              
              {userType !== 2 && (
              <Link href="/configuracion-producto" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiColorSwatch className="mr-2" /> Configuración de Producto
              </Link>
              )}
              
              {userType !== 2 && (
              <Link href="/productos" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiCube className="mr-2" /> Productos
              </Link>
              )}
              
              
              {/* {userType !== 2 && (
              <Link href="/almacen" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiTable className="mr-2" /> Almacén
              </Link>
              )} */}
              {/* <Link href="/requerimientos" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiClipboardCheck className="mr-2" /> Requerimientos
              </Link> */}
              {/* <div className="relative">
                <button onClick={toggleDropdown} className="flex items-center py-2 text-gray-800 hover:bg-gray-200 w-full">
                  <HiClipboardList className="mr-2" /> Herramientas
                  <HiChevronDown className="ml-auto" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 w-full mt-1 bg-white rounded-md shadow-lg z-10">
                    <Link href="/cuaderno-de-obra" onClick={closeDrawer} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Notebook
                    </Link>
                    <Link href="/asistencia" onClick={closeDrawer} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Asistencia
                    </Link>
                    <Link href={"#"} onClick={closeDrawer} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                      Checklist
                      <span className="relative inline-flex items-center bg-gray-200 text-gray-500 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                        <HiLockClosed />
                      </span>
                    </Link>
                    <Link href={"#"} onClick={closeDrawer} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Cronograma
                      <span className="relative inline-flex items-center bg-gray-200 text-gray-500 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                        <HiLockClosed />
                      </span>
                    </Link>
                  </div>
                )}
              </div> */}

              {/* <Link href="/mi-suscripcion" onClick={closeDrawer} className="flex items-center py-2 text-gray-800 hover:bg-gray-200">
                <HiCurrencyDollar className="mr-2" /> Mi Suscripción
              </Link> */}
            </div>
            
          </Drawer>
        </>
      )}
    </>
  );
}

export default Menu;

