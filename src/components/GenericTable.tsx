import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import { HiDocument } from "react-icons/hi";
import GenericModal, { GenericModalRef } from "./GenericModal";
import Badge from "./Badge";
import FileGallery from "./FileGallery";
import TableActions from "./TableActions"; // Importa el nuevo componente
import { formatDateTime } from "./Functions";
import { formatDate } from "./Functions";
import Notification from "./Notification";
import { useSession } from "next-auth/react";

interface Column<T> {
  key: keyof T;
  label: string;
  files?: boolean;
  isId?: boolean;
  hidden?: boolean;
  type?: string;
  disabled?: boolean;
  lookupEndpoint?: string; // Agregamos un endpoint opcional para hacer la búsqueda
  lookupKey?: string; // Clave en la API de lookup (ejemplo: "id")
  lookupLabel?: string; // Clave que queremos mostrar en lugar del ID (ejemplo: "name")
  customCSS?: string;
  customItem?: (value: any, item: T) => JSX.Element;
}

interface TableProps<T extends GenericItem> {
  apiEndpoint: string;
  title: string;
  columns: Column<T>[];
  columnsHiddens?: string[];
  alertName?: string;
  deleteProp: string;
  maxProductsPerPage?: number;
  hideBadge?: boolean;
  onSelectItem?: (item: T | null) => void;
  actionsDisabled?: boolean;
  apiEndpointForFilterData?:string;
}

const GenericTable = forwardRef (<T extends GenericItem>({
  apiEndpoint,
  title,
  columns,
  columnsHiddens = [],
  alertName= "",
  deleteProp,
  maxProductsPerPage = 10,
  hideBadge=false,
  onSelectItem,
  actionsDisabled = false,
  apiEndpointForFilterData = "",
}: TableProps<T>, ref: React.Ref<{ handleSave?: (data: Record<string, any>, actionMode?: "create" | "edit" | "delete" | "view" | null) => Promise<void>; }>, ) => {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "delete" | "create" | "view" | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<{ url: string; type: string; publicId: string }[]>([]);
  const [lookupData, setLookupData] = useState<{ [key: string]: { [id: number]: string } }>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef<GenericModalRef>(null);

  useEffect(() => {
    fetchItems();
    fetchLookupData();
  }, [apiEndpoint, apiEndpointForFilterData]);

  
  // Exponer fetchItems al componente padre
  useImperativeHandle(ref, () => ({
    handleSave: (data, actionMode = "create") => handleSave(data, actionMode),
  }));

  const handleSave = async (data: Record<string, any>, actionMode: "edit" | "delete" | "create" | "view" | null = "create"): Promise<void> => {
    if (!modalRef.current) {
      console.error("modalRef.current no está disponible");
      return;
    }

    console.log('modalMode',actionMode);
  
    await modalRef.current.saveEntity(data, actionMode);
  };

  const fetchItems = async () => {
    try {
      const endPoint = apiEndpointForFilterData !== "" ? apiEndpointForFilterData : apiEndpoint;
      const res = await fetch(endPoint);
      if (!res.ok) throw new Error("Error al cargar datos");
      const data: T[] = await res.json();
      setItems(data);
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  const handleSelectItem = (item: T) => {
    setSelectedItem(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const ShowNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
  
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchLookupData = async () => {
    const lookupRequests = columns
      .filter(col => col.lookupEndpoint && col.lookupKey && col.lookupLabel)
      .map(async col => {
        if (!col.lookupEndpoint || !col.lookupKey || !col.lookupLabel) return null;
  
        try {
          const res = await fetch(col.lookupEndpoint);
          if (!res.ok) throw new Error(`Error al obtener datos de ${String(col.lookupEndpoint)}`);
          const data = await res.json();
  
          return {
            key: String(col.key), // Asegura que `col.key` sea string
            data: Object.fromEntries(
              data.map((item: Record<string, any>) => [
                String(item[col.lookupKey!]), // Convierte a string de forma segura
                String(item[col.lookupLabel!]),
              ])
            ),
          };
        } catch (err) {
          console.error(`Error en lookup para ${String(col.key)}:`, (err as Error).message);
          return { key: String(col.key), data: {} };
        }
      });
  
      console.log(lookupRequests);
    const lookupsArray = (await Promise.all(lookupRequests)).filter(Boolean);
    const lookups = Object.fromEntries(lookupsArray.map(l => [l!.key, l!.data]));
      
    setLookupData(lookups);
  };
  
  const totalPages = Math.ceil(items.length / maxProductsPerPage);
  const displayedItems = items.slice(
    (currentPage - 1) * maxProductsPerPage,
    currentPage * maxProductsPerPage
  );
  

  const openGallery = (files: { url: string; type: string; publicId: string }[]) => {
    if (files && Array.isArray(files) && files.length > 0) {
      setGalleryFiles(files);
      setIsGalleryOpen(true);
    }
  };

  const handleOpenModal = (mode: "edit" | "delete" | "create" | "view") => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
  };

  

  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : undefined;
  const userType = session?.user?.type || '';

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center justify-between gap-2">
        {!hideBadge && <Badge customColor="bg-bramotors-red" customText={title} customClassName="self-start" />}
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2">
          {
            (userType === 2 || actionsDisabled) ?
            <div className="flex items-center gap-2">
              <div className="px-3 py-4"></div>
            </div>
            :
            <TableActions
            onCreate={() => handleOpenModal("create")}
            onEdit={() => handleOpenModal("edit")}
            onDelete={() => handleOpenModal("delete")}
            onCancel={() => setSelectedItem(null)}
            selectedItem={selectedItem}
          />
          }
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left text-sm">
              {columns.map((col) => (
                <th key={col.key as string} className={`border p-2 ${columnsHiddens.includes(col.key as string) ? "hidden" : ""}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-sm text-gray-500">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              displayedItems.map((item) => (
                <tr
                  key={item.id}
                  className={`${actionsDisabled ? "cursor-default" : "cursor-pointer"} text-sm ${selectedItem?.id === item.id ? "bg-blue-200" : "bg-white"}`}
                  onClick={!actionsDisabled ? () => handleSelectItem(item) : undefined}

                >
                  {columns.map((col) => (
                    <td key={col.key as string} className={`border p-2 ${col.customCSS} ${columnsHiddens.includes(col.key as string) ? "hidden" : ""}`}>
                    {
                      col.customItem ? (
                        col.customItem(item[col.key], item) // Usa customItem si está definido
                      ) : col.files ? (
                      Array.isArray(item[col.key]) && item[col.key].length > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGallery(item[col.key]);
                          }}
                          className="px-2 py-1 bg-bramotors-red text-white rounded hover:bg-bramotors-red/70 flex items-center gap-1"
                        >
                          <HiDocument />
                          {item[col.key].length} archivo(s)
                        </button>
                      ) : (
                        "No hay archivos"
                      )
                    ) : col.lookupEndpoint ? (
                      lookupData[col.key as string]?.[item[col.key]] || item[col.key]
                    ) : col.type === "color" ? (
                      <Badge customColor={item[col.key] as string} customText={item[col.key] as string} />
                    )  : col.type === "date" ? (
                      item[col.key] ? formatDateTime(item[col.key]?.toString()) : ""
                    ):
                     col.type === "only_date" ? (
                      item[col.key] ? formatDate(item[col.key]?.toString()) : ""
                    ) :(
                      item[col.key]
                    )}
                  </td>
                  
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={totalPages === 0 || currentPage === 1}
            className="text-xs px-4 py-2 mx-2 bg-bramotors-red text-white rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs px-4 py-2">
            Página {totalPages === 0 ? 0 : currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={totalPages === 0 || currentPage === totalPages}
            className="text-xs px-4 py-2 mx-2 bg-bramotors-red text-white rounded disabled:opacity-50"
          >
            Siguiente
            </button>
        </div>

      <GenericModal
        deleteProp={deleteProp}
        alertName={alertName}
        apiEndpoint={apiEndpoint}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode ?? "edit"}
        entityId={selectedItem?.id ?? null}
        entityName={title}
        onEntityUpdated={fetchItems}
        fields={columns.map((col) => ({
          key: col.key as string,
          label: col.label,
          files: col.files,
          type: col.type as "text" | "email" | "number" | "tel" | "file",
          isId: col.isId || col.disabled,
          hidden: col.hidden,
          options: col.lookupEndpoint
          ? Object.entries(lookupData[col.key as string] || {}).map(([value, label]) => ({
              value,
              label,
            }))
          : undefined,
        }))}
        ShowNotification={ShowNotification}
        ref={modalRef}
      />

      {isGalleryOpen && <FileGallery files={galleryFiles} onClose={() => setIsGalleryOpen(false)} />}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
});

GenericTable.displayName = "GenericTable";

export default GenericTable;
