import React from "react";

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  exportCategories?: boolean;
  onExportCategories?: (uniqueCategories: string[]) => void;

};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="mb-4 w-64">
      <h2 className="text-sm font-semibold mb-1">Filtrar por categoría</h2>
      <select
        onChange={(e) => setSelectedCategory(e.target.value === "Todos" ? null : e.target.value)}
        value={selectedCategory || "TODOS"}
        className="w-full text-xs px-4 py-2 bg-gray-200 rounded-lg text-gray-700 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="Todos" >Todos</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
