"use client";

import GenericTable from "@/components/GenericTable";

function CategoriesAndUnits() {
  
  const columnsHiddens = ["id"];

  const categoriesColumns = [
    { key: "id", label: "ID", isId: true, hidden: true},
    { key: "name", label: "Nombre" }
  ];

  const marcasColumns = [
    { key: "id", label: "ID", isId: true, hidden: true},
    { key: "name", label: "Nombre" }
  ];
  const unitsColumns = [
    { key: "id", label: "ID", isId: true, hidden: true},
    { key: "name", label: "Nombre" }
  ];

  

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 p-4">
      <div className="flex-1">
        <GenericTable 
          apiEndpoint={"api/categorias"} 
          title={"Categorías"} 
          columns={categoriesColumns} 
          columnsHiddens={columnsHiddens}
          alertName="LA CATEGORÍA"
          deleteProp="name"
        />
      </div>

      <div className="flex-1">
        <GenericTable 
          apiEndpoint={"api/marcas"} 
          title={"Marcas"} 
          columns={marcasColumns} 
          columnsHiddens={columnsHiddens}
          alertName="LA MARCA"
          deleteProp="name"
        />
      </div>

      <div className="flex-1">
        <GenericTable 
          apiEndpoint={"api/unidades"} 
          title={"Unidades"} 
          columns={unitsColumns}
          columnsHiddens={columnsHiddens}
          alertName="LA UNIDAD"
          deleteProp="name"
        />
      </div>
    </div>
  );
}

export default CategoriesAndUnits;
