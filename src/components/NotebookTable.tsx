"use client";
import BookModal from "@/components/BookModal"; // Importa el nuevo modal
import { useBooks } from "@/context/BookContext";
import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { useConstructions } from "@/context/ConstructionContext";
import BookCard from "./BookCard";
import { HiPlus, HiDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import Badge from "./Badge";
import jsPDF from "jspdf";
import "jspdf-autotable";

function NotebookData() {
  const { books, loadBooks, selectedBook, setSelectedBook } = useBooks();
  const { constructions, loadConstructions } = useConstructions();
  const [showForm, setShowForm] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete" | "view">("create");
  const { data: session } = useSession();
  const userType = session?.user?.type || "";
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const thStyle = "bg-gray-200 text-left text-sm text-black";

  const [filters, setFilters] = useState({
    constructionId: '',
    startDate: '',
    endDate: ''
  });

  // Actualizar filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reiniciar la página al aplicar filtros
  };



  useEffect(() => {
    loadBooks();
    loadConstructions();
  }, []);

  const handleOpenModal = (mode: "create" | "edit" | "delete" | "view", book?: any) => {
    setModalMode(mode);
    setSelectedBook(book || null);
    setShowForm(true);
  };

  const handleBookAddedOrUpdated = () => {
    loadBooks();
    setShowForm(false);
  };

  const parseDate = (dateString: string | null | undefined): Date | null => {
    return dateString ? new Date(dateString) : null;
  };


  const filteredBooks = books.filter(book => {
    const bookDate = new Date(book.createdAt); // Convertir book.createdAt a Date
    const startDate = parseDate(filters.startDate);
    const endDate = parseDate(filters.endDate);
  
    const dateInRange =
      (!startDate || bookDate.getTime() >= startDate.getTime()) &&
      (!endDate || bookDate.getTime() <= endDate.getTime());
  
    return (
      filters.constructionId !== '' && // Ahora solo muestra libros si hay un constructionId seleccionado
      book.constructionId != null && book.constructionId.toString() === filters.constructionId &&
      dateInRange
    );
  });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const displayedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);



  const handleExportPDF = () => {
    if (!filters.constructionId) {
      alert("Debe seleccionar un proyecto antes de exportar.");
      return;
    }
    
    if (filteredBooks.length === 0) {
      alert("No hay datos para exportar con los filtros seleccionados.");
      return;
    }
  
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Reporte de Cuaderno de Obra", 10, 10);
    doc.setFontSize(10);
    doc.text(`Fecha de generación: ${new Date().toLocaleString("es-PE")}`, 10, 15);
    
    const construction = constructions.find(construction => construction.id === Number(filters.constructionId));
    doc.text(`Proyecto: ${construction?.description || 'No disponible'}`, 10, 20);
    doc.setLineWidth(0.5);
    doc.line(10, 28, doc.internal.pageSize.width - 7, 28);
  
    const columns = ["CUADRILLA", "DESCRIPCIÓN", "OBSERVACIONES", "FECHA"];
    const columnWidths = [23, 115, 40, 15];
    const startX = 10;
    const startY = 25;
    const rowHeight = 6;
    const pageHeight = doc.internal.pageSize.height - 15;
  
    let currentY = startY;
  
    const drawTableHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      let currentX = startX;
      columns.forEach((col, index) => {
        doc.text(col, currentX, currentY);
        currentX += columnWidths[index];
      });
      doc.line(startX, currentY + 2, startX + columnWidths.reduce((a, b) => a + b), currentY + 2);
      currentY += rowHeight;
    };
  
    drawTableHeader();
    doc.setFontSize(8);
  
    filteredBooks.forEach((book) => {
      let currentX = startX;

      let cuadrilla = "";
      if (book?.trabajadores.length > 0) {
        // Agrupar trabajadores por cargo
        const groupedWorkers: Record<string, number> = book.trabajadores.reduce((acc, worker) => {
          const cargo = worker.cargo?.nombre || "SIN CARGO";
          acc[cargo] = (acc[cargo] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    
        cuadrilla = Object.entries(groupedWorkers)
          .map(([cargo, count]) => `- ${cargo}: ${count}`)
          .join("\n");
      } else if (book?.team && Object.keys(book?.team ).length > 0) {
        cuadrilla = Object.entries(JSON.parse(book?.team || "{}")).map(([key, value]) => `- ${key}: ${value}`).join("\n");
      } else {
        cuadrilla = "Vacío";
      }

      
      const row = [
        cuadrilla,
        book.description || "",
        book.comment || "",
        new Date(book.createdAt).toLocaleDateString("es-PE"),
      ];
  
      let maxRowHeight = row.reduce((maxHeight, cell, index) => {
        const textLines = doc.splitTextToSize(cell, columnWidths[index]);
        return Math.max(maxHeight, textLines.length * rowHeight * 0.6);
      }, rowHeight);
  
      if (currentY + maxRowHeight > pageHeight) {
        doc.addPage();
        currentY = startY;
        drawTableHeader();
      }
  
      currentX = startX;
      row.forEach((cell, index) => {
        const textLines = doc.splitTextToSize(cell, columnWidths[index]);
        doc.text(textLines, currentX, currentY, { align: "left" });
        currentX += columnWidths[index];
      });
  
      currentY += maxRowHeight;
    });
  
    doc.save("reporte-cuaderno-de-obra.pdf");
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center gap-2">
        
      <Badge customColor="bg-blue-800" customText="Módulo de Cuaderno de Obra" />

        <div className="flex justify-end items-center gap-2 sm:hidden">
        { userType != 2 && ( 
          <button
            onClick={handleExportPDF}
            disabled={filters.constructionId==""}
            className={`px-3 py-2 text-white rounded ${filters.constructionId!="" ? "bg-blue-800 hover:bg-blue-800" : "bg-gray-400 cursor-not-allowed"} flex items-center gap-2`}
          >
            <HiDownload />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        )}
        { userType != 2 && ( 
          <button
            onClick={() => handleOpenModal("create")}
            disabled={filters.constructionId==""}
            className={`px-3 py-2  text-white rounded ${filters.constructionId!="" ? "bg-blue-800 hover:bg-sky-600" : "bg-gray-400 cursor-not-allowed"} flex items-center gap-2`}
          >
            <HiPlus />
            <span className="hidden sm:inline">Nuevo</span>
          </button>)}
        </div>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">


          {/* Filtro de Proyecto - Ocupa toda la pantalla en móviles */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 w-full">
            <span className="font-semibold text-xs uppercase text-black dark:text-gray-400">PROYECTO</span>
            <select
              name="constructionId"
              className="text-sm w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={filters.constructionId}
              onChange={handleFilterChange}
            >
            <option value="" disabled>
              Seleccione un proyecto
            </option>
              {constructions.map(construction => (
                <option key={construction.id} value={construction.id}>
                  {construction.description}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Inicio */}
          <div className="col-span-1 w-full">
            <span className="font-semibold text-xs uppercase text-black dark:text-gray-400">FECHA DE INICIO</span>
            <input
              type="date"
              name="startDate"
              className="text-sm w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Desde"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          {/* Fecha de Fin */}
          <div className="col-span-1 w-full">
            <span className="font-semibold text-xs uppercase text-black dark:text-gray-400">FECHA DE FIN</span>
            <input
              type="date"
              name="endDate"
              className="text-sm w-full px-4 py-2 text-black border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Hasta"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div className=" justify-end items-center gap-2 sm:flex hidden">
          { userType != 2 && ( 
            <button
              onClick={handleExportPDF}
              disabled={filters.constructionId==""}
              className={`px-3 py-2  text-white rounded ${filters.constructionId!="" ? "bg-blue-800 hover:bg-sky-600" : "bg-gray-400 cursor-not-allowed"} flex items-center gap-2"`}
            >
              <HiDownload />
              <span className="hidden sm:inline sm:pl-2">Exportar</span>
            </button>
          )}
          { userType != 2 && ( 
            <button
              onClick={() => handleOpenModal("create")}
              disabled={filters.constructionId==""}
              className={`px-3 py-2  text-white rounded ${filters.constructionId!="" ? "bg-blue-800 hover:bg-sky-600" : "bg-gray-400 cursor-not-allowed"} flex items-center gap-2`}

            >
              <HiPlus />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
            )}
          </div>
        </div>





      </div>
      <BookModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        mode={modalMode}
        book={selectedBook}
        constructions={constructions}
        userType={userType}
        constructionId={Number(filters.constructionId)}
        onBookAddedOrUpdated={handleBookAddedOrUpdated}
      />

      <div className="overflow-x-auto rounded-lg w-full px-6 py-6">
        <Table hoverable className="w-full">
          <Table.Head>
            <Table.HeadCell className={thStyle}>Cuadrilla</Table.HeadCell>
            <Table.HeadCell hidden className={thStyle}>Team</Table.HeadCell>
            <Table.HeadCell className={thStyle}>Descripción</Table.HeadCell>
            <Table.HeadCell className={thStyle}>Observación</Table.HeadCell>
            <Table.HeadCell className={thStyle}>Archivos</Table.HeadCell>
            <Table.HeadCell className={thStyle}>Fecha</Table.HeadCell>
            <Table.HeadCell className={thStyle}>
              <span>Acción</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
          {displayedBooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-sm text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            ):
            displayedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                constructions={constructions}
                userType={userType}
                onBookUpdated={handleBookAddedOrUpdated}
                onOpenModal={() => handleOpenModal("edit", book)}
              />
            ))}
          
            
          </Table.Body>
        </Table>
      </div>
      <div className="flex justify-center py-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="text-xs px-4 py-2 mx-2 bg-blue-800 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-xs px-4 py-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="text-xs px-4 py-2 mx-2 bg-blue-800 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default NotebookData;
