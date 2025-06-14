import { HiPencil, HiTrash, HiX, HiPlus } from "react-icons/hi";

interface TableActionsProps {
  onCreate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCancel: () => void;
  selectedItem: any;
  lock?: boolean;
}

const TableActions = ({ onCreate, onEdit, onDelete, onCancel, selectedItem, lock = false}: TableActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onCreate} className="px-3 py-2 rounded bg-bramotors-red text-white hover:bg-bramotors-red/60">
        <HiPlus />
      </button>
      <button
        onClick={onEdit}
        disabled={!selectedItem || lock}
        className={`px-3 py-2 text-white rounded ${selectedItem ? "bg-bramotors-red hover:bg-bramotors-red/60" : "bg-gray-400 cursor-not-allowed"}`}
      >
        <HiPencil />
      </button>
      <button
        onClick={onDelete}
        disabled={!selectedItem || lock}
        className={`px-3 py-2 text-white rounded ${selectedItem ? "bg-bramotors-red hover:bg-bramotors-red/60" : "bg-gray-400 cursor-not-allowed"}`}
      >
        <HiTrash />
      </button>
      <button
        onClick={onCancel}
        disabled={!selectedItem || lock}
        className={`px-3 py-2 text-white rounded ${selectedItem ? "bg-bramotors-red hover:bg-bramotors-red/60" : "bg-gray-400 cursor-not-allowed"}`}
      >
        <HiX />
      </button>
    </div>
  );
};

export default TableActions;
