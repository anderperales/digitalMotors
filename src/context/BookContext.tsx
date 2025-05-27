"use client";

import { createContext, useState, useContext } from "react";
import { CreateBook, TrabajadorPersona, UpdateBook } from "@/interfaces/Book";
import { Book, Trabajador } from "@prisma/client";

// Ampliamos Book para incluir los archivos
interface BookWithFiles extends Book {
  files: { url: string; type: string; publicId: string }[]; // Tipando la relación de archivos
  trabajadores: TrabajadorPersona[]
}

// Definición del contexto para el modelo Book
export const BookContext = createContext<{
  books: BookWithFiles[]; // Cambiar el tipo de books a BookWithFiles
  loadBooks: () => Promise<void>;
  createBook: (book: CreateBook, files: { url: string; type: string; publicId: string}[], trabajadores:TrabajadorPersona[]) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  selectedBook: BookWithFiles | null; // Cambiar el tipo aquí también
  setSelectedBook: (book: BookWithFiles | null) => void; // Asegurarse de que acepta BookWithFiles
  updateBook: (id: number, book: UpdateBook, files: { url: string; type: string, publicId: string}[], trabajadores:TrabajadorPersona[]) => Promise<void>;
}>({
  books: [],
  loadBooks: async () => {},
  createBook: async (book: CreateBook, files, trabajadores) => {},
  deleteBook: async (id: number) => {},
  selectedBook: null,
  setSelectedBook: (book: BookWithFiles | null) => {},
  updateBook: async (id: number, book: UpdateBook, files, trabajadores) => {},
});

// Hook para usar el contexto de libros (Books)
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }
  return context;
};

// Proveedor del contexto de libros
export const BooksProvider = ({ children }: { children: React.ReactNode }) => {
  const [books, setBooks] = useState<BookWithFiles[]>([]); // Cambiar el tipo de books a BookWithFiles
  const [selectedBook, setSelectedBook] = useState<BookWithFiles | null>(null); // Cambiar el tipo de selectedBook

  async function loadBooks() {
    const res = await fetch("/api/cuaderno-de-obra");
    const data = await res.json();
  
    if (Array.isArray(data)) {
      // Asegúrate de incluir 'files' en la consulta
      setBooks(data.map((book: any) => ({
        ...book,
        files: book.files || [], // Agregar archivos si están disponibles
        trabajadores: book.trabajadores || []
      })));
    } else {
      setBooks([]); // En caso de error, asignamos un array vacío
    }
  }

  // Función para crear un nuevo libro
  async function createBook(book: CreateBook, files: { url: string; type: string, publicId: string }[], trabajadores:TrabajadorPersona[]) {
    const res = await fetch("/api/cuaderno-de-obra", {
      method: "POST",
      body: JSON.stringify({ ...book, files, trabajadores}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newBook = await res.json();
    setBooks([...books, { ...newBook, files, trabajadores}]); // Asegurarse de agregar los archivos correctamente
  }

  async function deleteBook(id: number) {
    const res = await fetch("/api/cuaderno-de-obra/" + id, {
      method: "DELETE",
    });
    const data = await res.json();
    setBooks(books.filter((book) => book.id !== id));
  }

  async function updateBook(id: number, book: UpdateBook, files: { url: string; type: string, publicId: string}[], trabajadores:TrabajadorPersona []) {
    const res = await fetch("/api/cuaderno-de-obra/" + id, {
      method: "PUT",
      body: JSON.stringify({ ...book, files, trabajadores}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedBook = await res.json();
    setBooks(books.map((book) => (book.id === id ? { ...updatedBook, files, trabajadores} : book))); // Actualiza correctamente los archivos
  }

  return (
    <BookContext.Provider
      value={{
        books,
        loadBooks,
        createBook,
        deleteBook,
        selectedBook,
        setSelectedBook,
        updateBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
