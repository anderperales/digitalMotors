import { Book, Trabajador } from "@prisma/client";


export interface TrabajadorPersona extends Trabajador {
  id: number,
  persona: {id: number, nombres: string, apellidos: string},
  cargo: {id: number, nombre: string}
}
export interface BookWithFiles extends Book {
    files: { url: string; type: string; publicId: string}[]; // Asegúrate de que esta propiedad esté presente
    trabajadores: TrabajadorPersona[]
  }
export type CreateBook = Omit<Book, "id" | "createdAt" | "updatedAt">;

export type UpdateBook = Partial<CreateBook> & {
    files?: File[]; // Agregar archivos opcionalmente al actualizar
    trabajadores?: TrabajadorPersona[]
  };