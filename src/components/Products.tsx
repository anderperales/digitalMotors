"use client";

import GenericTable from "@/components/GenericTable";

function Products({ hideBadge = false, customTitle = "Productos", onSelectProduct }: { hideBadge?: boolean, customTitle?: string, onSelectProduct?: (product: any) => void; }) {
  
  const columnsHiddens = ["id", "unitId", "categoryId", "brandId"];

  const columns = [
    { key: "id", label: "ID", isId: true, hidden: true },
    { key: "name", label: "Nombre" },
    { key: "purchasePrice", label: "Precio compra", type: "currency" },
    { key: "salePrice", label: "Precio venta", type: "currency" },
    { key: "color", label: "Color" },
    { key: "brandId", label: "Marca", type: "number", lookupEndpoint: "api/marcas", lookupKey: "id", lookupLabel: "name" }, // <- relación
    { key: "brand", label: "Marca", hidden: true }, // <- para mostrar si se usa customItem
    { key: "weight", label: "Peso", type: "number" },
    { key: "size", label: "Tamaño" },
    { key: "unitId", label: "Unidad", type: "number", lookupEndpoint: "/api/unidades", lookupKey: "id", lookupLabel: "name" },
    { key: "unit", label: "Unidad", hidden: true },
    { key: "condition", label: "Uso", type: "select", options: [{ value: "new", label: "Nuevo" }, { value: "used", label: "Usado" }] },
    { key: "year", label: "Año", type: "number" },
    { key: "files", label: "Fotos", files: true },
    { key: "notes", label: "Observaciones" },
    { key: "categoryId", label: "Categoría", type: "number", lookupEndpoint: "/api/categorias", lookupKey: "id", lookupLabel: "name" },
    { key: "category", label: "Categoría", hidden: true }
  ];

  return (
    <div>
      <GenericTable 
        apiEndpoint={"api/productos"} 
        title={customTitle}
        columns={columns}
        columnsHiddens={columnsHiddens}
        deleteProp="name"
        alertName="EL PRODUCTO"
        hideBadge={hideBadge}
        onSelectItem={onSelectProduct}
      />
    </div>
  );
}

export default Products;