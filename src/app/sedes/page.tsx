"use client";

import GenericTable from "@/components/GenericTable";

function Sedes() {

  const columnsHiddens = ["id"];
  const columns = [
    { key: "id", label: "ID", isId: true, hidden: true},
    { key: "companyId", label: "Empresa", type:"number", lookupEndpoint: "/api/empresas", lookupKey: "id", lookupLabel: "companyName"},
    { key: "description", label: "Descripción" },
    { key: "address", label: "Dirección"},
    { key: "startDate", label: "Fecha de Inicio", type:"date"},
    { key: "endDate", label: "Fecha de Fin", type:"date"},
    { key: "latitude", label: "Latitud" },
    { key: "longitude", label: "Longitud" },
  ];

  return (
    <div>
        <GenericTable 
          apiEndpoint={"api/sedes"} 
          title={"mis sedes"} 
          columns={columns}
          columnsHiddens={columnsHiddens}
          deleteProp="description"
          alertName="EL PROYECTO"
        />
    </div>
  );
}

export default Sedes;
