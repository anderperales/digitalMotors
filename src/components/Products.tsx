"use client";

import GenericTable from "@/components/GenericTable";

function Products({ hideBadge = false, customTitle="Productos", onSelectProduct}: { hideBadge?: boolean, customTitle?: string, onSelectProduct?: (product: any) => void;}) {
  
  
  const columnsHiddens = ["id", "unitId", "categoryId"];


  const columns = [
    { key: "id", label: "ID", isId: true, hidden: true},
    { key: "name", label: "Nombre", },
    { key: "unitId", label: "Unidad", type:"number", lookupEndpoint: "/api/unidades", lookupKey: "id", lookupLabel: "name"},
    { key: "unit", label: "Unidad", hidden: true, 
      customItem: (value: any) => {
        return <span className="text-red-600">{value}</span>
      },
    },
    { key: "categoryId", label: "Categoría", type:"number", lookupEndpoint: "/api/categorias", lookupKey: "id", lookupLabel: "name"},
    { key: "category", label: "Categoría", hidden: true },
    { key: "files", label: "Fotos", files: true}
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
