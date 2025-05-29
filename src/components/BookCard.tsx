import { Construction } from "@prisma/client";
import { useBooks } from "@/context/BookContext";
import { HiTrash, HiPencil, HiDocument, HiDownload } from 'react-icons/hi';
import { Modal, Table } from "flowbite-react";
import { BookWithFiles } from "@/interfaces/Book";
import { useEffect, useState } from "react";
import FileGallery from "./FileGallery";
import { formatDateTime } from "./Functions";
import { saveAs } from "file-saver";
import JSZip from "jszip";

function BookCard({
  book,
  constructions,
  userType,
  onBookUpdated,
  onOpenModal,
}: {
  book: BookWithFiles;
  constructions: Construction[];
  userType: number;
  onBookUpdated?: () => void;
  onOpenModal?: () => void;
}) {
  const { deleteBook } = useBooks();

  const [isTrabajadoresModalOpen, setIsTrabajadoresModalOpen] = useState(false);
  const [selectedTrabajadores, setSelectedTrabajadores] = useState(book?.trabajadores || []);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<{ url: string; type: string; publicId: string }[]>([]);

  const openGallery = () => {
    if (book.files && Array.isArray(book.files)) {
      setGalleryFiles(book.files);
    }
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const toggleTrabajadoresModal = () => {
    setIsTrabajadoresModalOpen(!isTrabajadoresModalOpen);
  };


  useEffect(() => {
    setSelectedTrabajadores(book?.trabajadores || []);
  }, [book]);


  const getExtension = (file: { url: string; type: string }) => {
    // Opción A: desde el MIME
    const mimeExt = file.type.split("/")[1];              // "jpeg", "png", "webp"
    return mimeExt === "jpeg" ? "jpg" : mimeExt;
  
    // Opción B (desde la URL):
    // const parts = file.url.split(".");
    // return parts[parts.length - 1].split("?")[0];       // "jpg", "png", "webp"
  };
  
// 1) Ajusta la firma para recibir el nombre de proyecto y la fecha
const downloadFiles = async (
  files: { url: string; type: string }[],
  projectName: string,
  createdAt: string
) => {
  try {
    const zip = new JSZip();

    // 2) Sacamos solo YYYY-MM-DD de la fecha
    const dateOnly = new Date(createdAt).toISOString().split("T")[0];
    const folderName = `${projectName}_${dateOnly}`;

    // 3) Creamos la carpeta con ese nombre
    const folder = zip.folder(folderName);
    if (!folder) throw new Error("No se pudo crear la carpeta base.");

    await Promise.all(
      files.map(async (file, idx) => {
        const res = await fetch(file.url);
        const blob = await res.blob();

        // 4) Calculamos la extensión limpia
        const mimeExt = file.type.split("/")[1] || "";
        const ext = mimeExt === "jpeg" ? "jpg" : mimeExt;

        // 5) Nombre secuencial: 1.jpg, 2.png, etc.
        const filename = `${idx + 1}.${ext}`;

        folder.file(filename, blob, { binary: true });
      })
    );

    // 6) Generamos y disparar descarga con nombre <project>_<fecha>.zip
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${folderName}.zip`);
  } catch (error) {
    console.error("Error creando ZIP:", error);
  }
};

  
  
  return (
    <>
      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
        
        <Table.Cell
          className="px-6 py-4 whitespace-pre-wrap cursor-pointer hover:bg-gray-200"
          onClick={toggleTrabajadoresModal}
        >
            {book?.trabajadores && book.trabajadores.length > 0 ? (
              Object.entries(
                book.trabajadores.reduce((acc, trabajador) => {
                  const cargo = trabajador.cargo?.nombre || "SIN CARGO";
                  acc[cargo] = (acc[cargo] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([cargo, count]) => (
                <div key={cargo}>
                  <strong className="text-xs font-semibold">{cargo.toUpperCase()}:</strong> {count}
                </div>
              ))
            )  : book?.team ? (
              <ul className="list-disc pl-5 text-xs">
              {book?.team && typeof book.team === "string" ? (
                Object.entries(JSON.parse(book.team)).map(([role, val]) => (
                  <li key={role} className="text-gray-700">
                    <span>{role}: {String(val)}</span> 
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No hay datos disponibles</li>
              )}
            </ul>
            
            ) : (
              <span className="text-red-500 text-xs font-semibold">Vacío</span>
            )}
        </Table.Cell>

        <Table.Cell className="px-6 py-4 min-w-[650px] md:min-w-[650px] whitespace-pre-wrap">{book.description}</Table.Cell>
        <Table.Cell className="px-6 py-4 min-w-[250px] md:min-w-[250px] whitespace-pre-wrap">{book.comment}</Table.Cell>
        <Table.Cell className="px-6 py-4 min-w-[205px] md:min-w-[205px]">
          {book.files && book.files.length > 0 ? (
            <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openGallery();
              }}
              className="px-2 py-1 bg-blue-800 text-white rounded hover:bg-sky-600 flex items-center gap-1"
            >
              <HiDocument />
              {book.files.length} archivo(s)
            </button>
            {/* Botón para descargar el archivo .rar */}
            <button
                onClick={(e) => {
                  e.stopPropagation();
                  const project = constructions.find(c => c.id === book.constructionId);
                  const projectName = project ? project.description : 'proyecto';
                  downloadFiles(
                    book.files,
                    projectName,
                    book.createdAt.toString()
                  );
                }}
                className="px-2 py-1 bg-blue-800 text-white rounded hover:bg-sky-600 flex items-center gap-1"
              >
                <HiDownload />
              </button>
            </div>
          ) : (
            <div className="flex items-center">No hay archivos</div>
          )}
        </Table.Cell>

        <Table.Cell className="px-6 py-4">{formatDateTime(book.createdAt.toString())}</Table.Cell>

        <Table.Cell className="px-6 py-4">
          <div className="flex gap-x-2">
            {userType !== 2 && (
              <>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (confirm("¿Estás seguro de que deseas eliminar este libro?")) {
                      await deleteBook(Number(book.id));
                    }
                  }}
                >
                  <HiTrash className="text-2xl text-red-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenModal) onOpenModal();
                  }}
                >
                  <HiPencil className="text-2xl" />
                </button>
              </>
            )}
          </div>
        </Table.Cell>

        {isGalleryOpen && <FileGallery files={galleryFiles} onClose={closeGallery} />}
      </Table.Row>


      {/* 🔹 MODAL PARA LISTAR TRABAJADORES */}
      {isTrabajadoresModalOpen && (
        
        <Modal show={isTrabajadoresModalOpen} onClose={toggleTrabajadoresModal} >
          <Modal.Header>Lista de Trabajadores</Modal.Header>
          <Modal.Body>
            <ul className="space-y-2  max-h-96 overflow-auto">
              {selectedTrabajadores.map((trabajador) => (
                <li key={trabajador.id} className="border-b py-2">
                  <span className="font-semibold">{trabajador.persona.nombres} {trabajador.persona.apellidos}</span> - {trabajador.cargo.nombre}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              onClick={toggleTrabajadoresModal}
            >
              Cerrar
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default BookCard;
