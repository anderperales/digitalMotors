"use client";

import GenericTable from "@/components/GenericTable";

function DatosGenerales() {
  const columns = [
    { key: "nombres", label: "Nombres",},
    { key: "apellidos", label: "Apellidos" },
    { key: "celular", label: "Celular" },
    { key: "direccion", label: "Dirección" },
    { key: "email", label: "Email" },
    { key: "constructionId", label: "Proyecto", type:"number", lookupEndpoint: "/api/sedes", lookupKey: "id", lookupLabel: "description"},
    { key: "idCargo",  label: "Cargo", type:"number", lookupEndpoint: "/api/cargos", lookupKey: "id", lookupLabel: "nombre", }
  ];

  return (
    <div>
      <GenericTable apiEndpoint="/api/trabajadores"  deleteProp="nombres" alertName="EL TRABAJADOR" title="Trabajadores" columns={columns} />
    </div>
  );
}

export default DatosGenerales;
