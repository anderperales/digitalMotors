import React, { useEffect, useState } from "react";

interface GenericItem {
  [key: string]: any;
}

interface GenericFilterProps<T extends GenericItem> {
  endPoint?: string;
  title: string;
  items?: T[];
  filterKey: keyof T;
  displayKey: keyof T;
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  onChange?: (value: string | null) => void;
  
  noSelectedText?: string;
}

const GenericFilter = <T extends GenericItem>({
  endPoint,
  title,
  items = [],
  filterKey,
  displayKey,
  selectedValue,
  setSelectedValue,
  onChange,
  noSelectedText = "Todos"
}: GenericFilterProps<T>) => {
  const [data, setData] = useState<T[]>(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!endPoint) return;

    setLoading(true);
    fetch(endPoint)
      .then((res) => res.json())
      .then((fetchedData) => {
        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else {
          console.error("El endpoint no devolvió un array.");
        }
      })
      .catch((error) => console.error("Error al obtener datos:", error))
      .finally(() => setLoading(false));
  }, [endPoint]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === noSelectedText ? null : event.target.value;
    setSelectedValue(value);
    onChange?.(value); // Llama a la función si está definida
  };

  // Eliminar duplicados y verificar que filterKey y displayKey existan
  const uniqueData = Array.from(
    new Set(data.map((item) => item[filterKey]))
  ).map((key) => data.find((item) => item[filterKey] === key));

  return (
    <div className="mb-4 w-64">
      <h2 className="text-sm font-semibold mb-1">
        {title}
      </h2>
      <select
        onChange={handleChange}
        value={selectedValue || noSelectedText}
        className="w-full text-xs px-4 py-2 bg-gray-200 rounded-lg text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        disabled={loading}
      >
        <option value={noSelectedText}>{noSelectedText}</option>
        {loading ? (
          <option>Cargando...</option>
        ) : (
          uniqueData.map((item) =>
            item && item[filterKey] && item[displayKey] ? (
              <option key={item[filterKey]} value={String(item[filterKey])}>
                {String(item[displayKey])}
              </option>
            ) : null
          )
        )}
      </select>
    </div>
  );
};

export default GenericFilter;
