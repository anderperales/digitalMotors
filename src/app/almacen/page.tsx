
"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight, HiX } from "react-icons/hi";
import Badge from "@/components/Badge";
import GenericTable from "@/components/GenericTable";
import GenericFilter from "@/components/GenericFilter";
import GenericFilterV2 from "@/components/GenericFilterV2";
import Products from "@/components/Products";
import { Label } from "flowbite-react";


const hideKardexColumns = ["id", "cantidad", "unidad", "categoria"];
const kardexColumns = [
  { key: "id", label: "ID", isId: true, hidden: true },
  { key: "createdAt", label: "F. Registro", type: "only_date"},
  { key: "updatedAt", label: "F. Modificación", type: "only_date"},
  { key: "producto", label: "Producto", },
  { key: "categoria", label: "Categoria" },
  { key: "unidad", label: "Unidad" },
  { key: "cantidad", label: "Cantidad" },
  {
    key: "tipo", label: "Tipo",
    customItem: (value: string) => {
      return value === "Salida" ? <span className="text-red-600">{value}</span> : <span className="text-sky-600">{value}</span>
    },
  },
  {
    key: "detalle", label: "Cantidad",
    customItem: (value: { unidad: string, cantidad: string }) => {
      return <div>{value?.cantidad}{" "}<span className="text-red-600">{value?.unidad}</span></div>
    },
  },
  { key: "solicitante", label: "Solicitante" },
  { key: "responsable", label: "Responsable" },
];



const Almacen = () => {


  const [products, setProducts] = useState<
    { id: number; name: string; unit: { id: number, name: string }; minStock: number, category: { id: number, name: string } }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIrregular, setShowIrregular] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string; unit: string, category: string } | null>(null);
  const [transactions, setTransactions] = useState<{
    stock: number; id: number; name: string; type: string; worker: string; responsible: string; date: string; productId: number
  }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchWorker, setSearchWorker] = useState("");
  const [selectedType, setSelectedType] = useState<"Entrada" | "Salida" | null>(null);
  const [transactionStock, setTransactionStock] = useState<number>(0); // Para manejar la cantidad en la transacción
  const [selectedWorker, setSelectedWorker] = useState<{ id: number; name: string } | null>(null); // Trabajador seleccionado
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Estado del filtro de categoría
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTrabajadorId, SetSelectedTrabajadorId] = useState<string |number | null>(null);


  const movimientosAlmacenRef = useRef<{
    handleSave: (data: Record<string, any>, mode: "view" | "create" | "edit" | "delete" | null | undefined) => Promise<void>;
  } | null>({
    handleSave: async () => { }
  });

  const updateMovimientosAlmacen = (data: Record<string, any>) => {
    if (movimientosAlmacenRef.current) {
      movimientosAlmacenRef.current.handleSave(data, "create")
    }
  };




  // Función para manejar la transacción
  const handleTransaction = (type: "Entrada" | "Salida") => {
    setSelectedType(type);
    setIsModalOpen(true);
    console.log("transaction type: ", type);
  };

  // Confirmar transacción
  const confirmTransaction = () => {
    if (!selectedProduct || !selectedType || transactionStock <= 0) return;

    const finalTranssactionStock = selectedType === "Entrada" ? transactionStock : transactionStock * -1;

    const parsedProjectId = selectedProjectId ? Number(selectedProjectId) : null;


    // acá debo agregar la lógica para alternar lo de responsable y solicitante
    const newTransaction = {
      solicitanteId: selectedTrabajadorId,
      cantidad: finalTranssactionStock,
      constructionId: parsedProjectId, // Se agrega la cantidad
      productId: selectedProduct.id, // Agregar ID del producto
    };
    updateMovimientosAlmacen(newTransaction)
    setIsModalOpen(false);
    setTransactionStock(0); // Resetear cantidad después de agregar la transacción
  };

  // Calcular stock actual
  const productBalance = (productId: number) => {
    return transactions
      .filter((t) => products.find((p) => p.id === productId)?.name === t.name)
      .reduce((sum, t) => (t.type === "Entrada" ? sum + t.stock : sum - t.stock), 0);
  };

  const irregularProducts = products.filter((p) => productBalance(p.id) < 0);
  const lowStockProducts = products.filter(
    (p) =>
      productBalance(p.id) >= 0 &&
      productBalance(p.id) < p.minStock &&
      transactions.some((t) => t.productId === p.id)
  );


  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <Badge customColor="bg-bramotors-red" customText="Módulo de Almacén"></Badge>

      <div className="m-3">
        <GenericFilter noSelectedText="Seleccione un proyecto" endPoint="/api/sedes" title={"Proyecto"} filterKey={"id"} displayKey={"description"} selectedValue={selectedProjectId} setSelectedValue={setSelectedProjectId}></GenericFilter>
      </div>

      {/* Alertas de Irregularidades */}
      {irregularProducts.length > 0 && (
        <div className="p-3 mb-3 bg-red-200 text-red-700 rounded">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowIrregular(!showIrregular)}
          >
            <strong>⚠️ Irregularidades detectadas ({irregularProducts.length})</strong>
            <span>{showIrregular ? "▲" : "▼"}</span>
          </div>
          {showIrregular && (
            <ul className="list-disc pl-5 mt-2 transition-all duration-300">
              {irregularProducts.map((p) => (
                <li key={p.id}>
                  {p.name} tiene saldo negativo ({productBalance(p.id)} {p.unit.name})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Alertas de Stock Bajo */}
      {lowStockProducts.length > 0 && (
        <div className="p-3 mb-3 bg-yellow-200 text-yellow-700 rounded">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowLowStock(!showLowStock)}
          >
            <strong>⚠️ Productos con stock bajo ({lowStockProducts.length})</strong>
            <span>{showLowStock ? "▲" : "▼"}</span>
          </div>
          {showLowStock && (
            <ul className="list-disc pl-5 mt-2 transition-all duration-300">
              {lowStockProducts.map((p) => (
                <li key={p.id}>
                  {p.name} tiene {productBalance(p.id)} {p.unit.name} en obra (mínimo: {p.minStock})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-2 mb-4">
        <Products onSelectProduct={setSelectedProduct} />
        {selectedProduct && selectedProjectId && (
          <div className="flex flex-col items-center text-xs gap-2 mb-4 p-4 bg-gray-100 rounded-lg ">
            {/* Información del Producto Seleccionado */}
            <div className="text-center">
              <p className="font-semibold text-sm text-gray-700">{selectedProduct.name}</p>
              <p className="text-gray-500">Unidad: {selectedProduct.category ?? "N/A"}</p>
              <p className="text-gray-500">Categoría: <span className="text-red-500">{selectedProduct.unit ?? "N/A"}</span></p>
            </div>

            <div className="flex justify-center gap-4 w-full">
              <button
                onClick={() => handleTransaction("Salida")}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
              >
                <HiArrowNarrowLeft className="text-sm" /> Salida
              </button>

              <button
                onClick={() => handleTransaction("Entrada")}
                className="flex items-center gap-2 px-4 py-2 bg-bramotors-red text-white rounded-lg shadow-md hover:bg-bramotors-red/60 transition"
              >
                Entrada <HiArrowNarrowRight className="text-sm" />
              </button>

              {/* Botón para limpiar selección */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg shadow-md hover:bg-gray-500 transition"
              >
                <HiX className="text-sm" /> Limpiar
              </button>
            </div>
          </div>

        )}
      </div>
      {
        selectedProjectId !== null &&
        <GenericTable
          apiEndpoint={"api/movimientos-almacen/"}
          apiEndpointForFilterData={"api/movimientos-almacen/"+selectedProjectId}
          title={"Kardex General"}
          columns={kardexColumns}
          columnsHiddens={hideKardexColumns}
          deleteProp="id"
          alertName="EL MOVIMIENTO"
          actionsDisabled={true}
          ref={movimientosAlmacenRef}
        />
      }

      {/* Modal de Transacción */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-sm font-semibold mb-4">Registrar {selectedType}</h2>
            <p className="mb-2 text-sm">
              <strong>Producto:</strong> {selectedProduct.name}
            </p>
            <p className="mb-4 text-sm">
              <strong>Unidad:</strong> {selectedProduct.unit}
            </p>

            <input
              type="number"
              placeholder="Cantidad"
              value={transactionStock || ""}
              onChange={(e) => {
                const value = e.target.value;
                setTransactionStock(parseInt(e.target.value) || 0)
              }}
              className="w-full p-2 border rounded-md mb-3 text-sm"
            />

            <GenericFilterV2 endPoint={"api/trabajadores-proyecto/"+selectedProjectId} title={"Trabajador"} filterKey={"id"} displayKey={"nombres"} selectedValue={selectedTrabajadorId} setSelectedValue={SetSelectedTrabajadorId} />
            
            <div className="flex justify-center mt-4 gap-2">
              <button onClick={() => setIsModalOpen(false)} className="text-xs  px-4 py-2 bg-gray-500 text-white rounded">
                Cancelar
              </button>
              <button
                onClick={() => confirmTransaction()}
                disabled={transactionStock <= 0} className={`text-xs  px-4 py-2 rounded ${transactionStock > 0 ? "bg-bramotors-red text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              // disabled={!selectedWorker || transactionStock <= 0}
              // className={`text-xs  px-4 py-2 rounded ${
              //   selectedWorker && transactionStock > 0 ? "bg-bramotors-red text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              // }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Almacen;
