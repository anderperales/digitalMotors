"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { useBooks } from "@/context/BookContext";
import { useSession } from "next-auth/react";
import { TrabajadorPersona } from "@/interfaces/Book";
import { ConstructionWithTrabajadores } from "@/interfaces/Construction";

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete" | "view";
  book?: any;
  constructions: ConstructionWithTrabajadores[];
  constructionId?: number;
  userType: string;
  onBookAddedOrUpdated: () => void;
}

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  mode,
  book,
  constructions,
  userType,
  constructionId,
  onBookAddedOrUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<any>();
  const { createBook, updateBook } = useBooks();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;
  const [files, setFiles] = useState<{ url: string; type: string; publicId: string }[]>([]);
  const [trabajadoresDeConstruccion, setTrabajadoresDeConstruccion] = useState<TrabajadorPersona[]>([]);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState<TrabajadorPersona[]>([]);
  useEffect(() => {
    if (mode === "edit" || mode === "view" || mode === "delete") {
      if (book) {
        setValue("description", book.description || "");
        setValue("comment", book.comment || "");
        setValue("team", book.team || "");
        setValue("trabajadores", book.trabajadores || []);
        setValue("constructionId", book.constructionId || "");
        setFiles(book.files || []);

        if (constructionId) {
          setValue("constructionId", constructionId.toString());
          const construccion = constructions.find(construction => construction.id === constructionId);

          if (construccion?.trabajadores) {
            setTrabajadoresDeConstruccion(construccion.trabajadores);
            setSelectedTrabajadores(book.trabajadores || []);
          } else {
            setTrabajadoresDeConstruccion([]);
            setSelectedTrabajadores([]);
          }
        }
      }
    } else {
      reset();
      setFiles([]);
      setSelectedTrabajadores([]);
      if (constructionId) {
        const construccion = constructions.find(construction => construction.id === constructionId);
        if (construccion?.trabajadores) {
          setTrabajadoresDeConstruccion(construccion.trabajadores);
        }
        setValue("constructionId", constructionId.toString());
      }
    }
  }, [mode, book, setValue, reset, constructionId, constructions]);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      const fileUrls = await Promise.all(uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "aguagutis_preset");

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al subir el archivo.");
        }

        const data = await response.json();
        return { url: data.secure_url, type: file.type, publicId: data.public_id };
      }));

      setFiles((prevFiles) => [...prevFiles, ...fileUrls]);
    }
  };

  const handleFileRemove = (fileUrl: string) => {
    setFiles((prevFiles) => prevFiles.filter(file => file.url !== fileUrl));
  };

  const handleTrabajadorChange = (trabajador: TrabajadorPersona) => {
    setSelectedTrabajadores((prev) => {
      const isSelected = prev.some((t) => t.id === trabajador.id);

      const newSelected = isSelected
        ? prev.filter((t) => t.id !== trabajador.id) // Quitar si ya está seleccionado
        : [...prev, trabajador]; // Agregar si no está seleccionado

      console.log("Trabajadores seleccionados:", newSelected);
      return newSelected;
    });
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!userId) return alert("Inicia sesión para continuar");

      const bookData = { ...data, userId, constructionId: Number(data.constructionId), files };
      if (book) {
        await updateBook(book.id, bookData, files, selectedTrabajadores);
      } else {
        await createBook(bookData, files, selectedTrabajadores);
      }
      onBookAddedOrUpdated();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white mx-auto   md:max-w-3xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Nuevo Registro"
              : mode === "edit" ? "Editar Registro"
                : mode === "delete" ? "Eliminar Registro"
                  : "Detalles del Registro"}
            {constructionId && ` | ${constructions.find(construction => construction.id === constructionId)?.description || "Proyecto Desconocido"}`}
          </h2>


          <button onClick={onClose} className="text-gray-600 hover:text-red-500">
            <HiX size={24} />
          </button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold">Descripción</label>
                <textarea {...register("description")} className="w-full p-2 border rounded"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold">Observación</label>
                <textarea {...register("comment")} className="w-full p-2 border rounded"></textarea>
              </div>

              <div>
  <label className="block text-sm font-semibold">Cuadrilla</label>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
    {Object.entries(
      trabajadoresDeConstruccion?.reduce((acc, trabajador) => {
        const cargo = trabajador.cargo.nombre;
        if (!acc[cargo]) acc[cargo] = [];
        acc[cargo].push(trabajador);
        return acc;
      }, {} as Record<string, TrabajadorPersona[]>)
    ).map(([cargo, trabajadores]) => (
      <fieldset key={cargo} className="border p-3 max-h-32 overflow-auto rounded-md shadow-sm">
        <legend className="block text-sm font-semibold text-gray-700">{cargo}</legend>
        {trabajadores.map((trabajador) => (
          <label key={trabajador.id} className="flex items-center space-x-2 mt-1">
            <input
              type="checkbox"
              checked={selectedTrabajadores.some((t) => t.id === trabajador.id)}
              onChange={() => handleTrabajadorChange(trabajador)}
              className="accent-blue-500"
            />
            <span>{trabajador.persona.nombres} {trabajador.persona.apellidos}</span>
          </label>
        ))}
      </fieldset>
    ))}
  </div>
</div>


              {!constructionId && (
                <div>
                  <label className="block text-sm font-semibold">Proyecto</label>
                  <select {...register("constructionId")} className="w-full p-2 border rounded">
                    {constructions.map((construction) => (
                      <option key={construction.id} value={construction.id}>
                        {construction.description}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold">Archivos</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((file, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img src={file.url} alt="Archivo" className="w-full h-full object-cover rounded" />
                      <button type="button" onClick={() => handleFileRemove(file.url)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs">X</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{mode === "edit" ? "Actualizar" : "Guardar"}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookModal;