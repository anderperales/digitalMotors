import React, { useEffect, useState } from "react";

interface GenericItem {
  [key: string]: any;
}

interface GenericFilterV2Props<T extends GenericItem> {
  endPoint?: string;
  title: string;
  items?: T[];
  filterKey: keyof T;
  displayKey: keyof T;
  selectedValue: string | number | null;
  setSelectedValue: (value: string | number | null) => void;
  onChange?: (value: string | number | null) => void;
  noSelectedText?: string;
}

const GenericFilterV2 = <T extends GenericItem>({
  endPoint,
  title,
  items = [],
  filterKey,
  displayKey,
  selectedValue,
  setSelectedValue,
  onChange,
  noSelectedText = "Todos",
}: GenericFilterV2Props<T>) => {
  const [data, setData] = useState<T[]>(items);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSelect = (value: string | number | null) => {
    setSelectedValue(value);
    onChange?.(value);
    setIsOpen(false);
  };

  const filteredData = data.filter((item) =>
    item[displayKey]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-64">
      <h2 className="text-sm font-semibold mb-1">{title}</h2>
      <div
        className="w-full bg-gray-200 text-xs px-4 py-2 rounded-lg border border-gray-300 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValue !== null
          ? data.find((item) => String(item[filterKey]) === String(selectedValue))?.[displayKey] || "Seleccionar"
          : noSelectedText}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 border-b text-sm outline-none"
          />
          <div className="max-h-40 overflow-auto">
            <div
              onClick={() => handleSelect(null)}
              className="p-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {noSelectedText}
            </div>
            {loading ? (
              <div className="p-2 text-sm text-gray-500">Cargando...</div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={String(item[filterKey])}
                  onClick={() => handleSelect(item[filterKey])}
                  className={`p-2 cursor-pointer text-sm rounded ${
                    String(selectedValue) === String(item[filterKey])
                      ? "bg-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {String(item[displayKey])}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericFilterV2;
``
