import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "email" | "number" | "tel" | "file" | "color" | "date" | "only_date";
  files?: boolean; // Si es true, habilita la carga de archivos
  hidden?: boolean; // Si es true, oculta el campo
  disabled?: boolean; // Si es true, bloquea el campo
  isId?: boolean; // Si es true, también bloquea el campo
  options?: { value: string | number; label: string }[]; // Para lookup
}

export interface GenericModalRef {
  saveEntity: (data: Record<string, any>, actionMode?: "create" | "edit" | "delete" | "view" | null) => Promise<void>;
}


interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete" | "view" | null;
  entityId?: number | null;
  entityName: string;
  apiEndpoint: string;
  onEntityUpdated: () => void;
  fields: FieldConfig[];
  alertName?: string;
  deleteProp: string;
  ShowNotification: (message: string, typeError: "success" | "error") => void;
  ref: React.Ref<GenericModalRef>;
}

const GenericModal: React.FC<GenericModalProps> = forwardRef(({
  isOpen,
  onClose,
  mode,
  entityId,
  entityName,
  apiEndpoint,
  onEntityUpdated,
  fields,
  alertName="",
  deleteProp,
  ShowNotification
}, ref) => {
  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState<Record<string, any> | null>(null);
  const [files, setFiles] = useState<{ url: string; type: string; publicId: string }[]>([]);
  const { register, handleSubmit, setValue, reset } = useForm<Record<string, any>>();


  useEffect(() => {
    if (!isOpen) return;
    if ((mode === "edit" || mode === "view" || mode === "delete") && entityId) {
      console.log(entity);
      fetchEntity(entityId);
    } else {
      reset();
      setEntity(null);
      setFiles([]);
    }
  }, [isOpen, mode, entityId]);
const fetchEntity = async (id: number) => {
  setLoading(true);
  try {
    const res = await fetch(`${apiEndpoint}/${id}`);
    if (!res.ok) throw new Error("Error al obtener la entidad");
    const data = await res.json();
    setEntity(data);

    const tempFiles: { url: string; type: string; publicId: string }[] = [];

    fields.forEach((field) => {
      let value = data[field.key] || "";

      if (field.files && Array.isArray(value)) {
        // Si el campo es de tipo archivo, lo asumimos como array de objetos con url, type y publicId
        tempFiles.push(...value);
      }

      if (field.type === "date" && value) {
        value = new Date(value).toISOString().split("T")[0];
      }

      setValue(field.key, value);
    });

    setFiles(tempFiles);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    console.log(e.target.files);
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files);
      const fileUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "aguagutis_preset");

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            { method: "POST", body: formData }
          );


          console.log(response);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al subir el archivo.");
          }

          const data = await response.json();
          return { url: data.secure_url, type: file.type, publicId: data.public_id };
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...fileUrls]);
      setValue(fieldKey, (prevFiles: any) => [...prevFiles, ...fileUrls]);
    }
  };



  const handleFileRemove = (fileUrl: string, fieldKey: string) => {
    const updatedFiles = files.filter((file) => file.url !== fileUrl);
    setFiles(updatedFiles);
    setValue(fieldKey, updatedFiles);
  };
  
  const saveEntity = async (data: Record<string, any>, actionMode: "create" | "edit" | "delete" | "view" | null) => {
    setLoading(true);
    try {
      // Convertir campos numéricos a número
      const processedData = { ...data };
      fields.forEach((field) => {
        if (field.type === "number" && processedData[field.key] !== "") {
          processedData[field.key] = Number(processedData[field.key]);
        }
      });
      
      console.log('actionMode from generic modal', actionMode);
      actionMode === null ? actionMode = mode : actionMode = actionMode;
      console.log('actionMode from generic modal2', actionMode);
  
      const method = actionMode === "edit" ? "PUT" : "POST";
      const body = JSON.stringify({ ...processedData, files });
  
      const res = await fetch(actionMode === "edit" ? `${apiEndpoint}/${entityId}` : apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
  
      if (!res.ok) {
        ShowNotification(`${alertName} ya existe. Use otro nombre.`, "error");
      } else {
        ShowNotification("Guardado exitosamente", "success");
        onEntityUpdated();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useImperativeHandle(ref, () => ({
    saveEntity: (data, actionMode = "create") => saveEntity(data, actionMode),
  }));

  const handleDelete = async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/${entityId}`, { method: "DELETE" });
      if (!res.ok) {
        ShowNotification("Este item se encuentra en uso", "error");
      } else {
        ShowNotification("Eliminado exitosamente", "success");
        onEntityUpdated();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full md:max-w-3xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">
            {mode === "create"
              ? `Nuevo ${entityName}`
              : mode === "edit"
                ? `Editar ${entityName}`
                : mode === "delete"
                  ? `Eliminar ${entityName}`
                  : `Detalles de ${entityName}`}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500">X</button>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit((data) => saveEntity(data, mode))} className="grid grid-cols-1 gap-4">
              {
                mode==="delete" ?

                <h2>{`¿Seguro que quieres eliminar ${entity?.[deleteProp]}?`}</h2>
                :
              <>
              {fields.map((field) => (
                !field.hidden && (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold">{field.label}</label>

                    {field.options ? (
                      <select
                        {...register(field.key)}
                        disabled={field.disabled || field.isId}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Seleccione una opción</option>
                        {field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.files ? (
                      <div>
                        {!field.disabled && !field.isId && (
                          <input
                            accept="image/*"
                            type="file"
                            multiple
                            onChange={(e) => handleFileChange(e, field.key)}
                            className="w-full p-2 border rounded"
                          />
                        )}
                        {files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {files.map((file, index) => (
                              <div key={index} className="relative w-20 h-20">
                                <img src={file.url} alt="Archivo" className="w-full h-full object-cover rounded" />
                                {!field.disabled && !field.isId && (
                                  <button
                                    type="button"
                                    onClick={() => handleFileRemove(file.url, field.key)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                  >
                                    X
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        {...register(field.key)}
                        disabled={field.disabled || field.isId}
                        className={`w-full p-2 border rounded ${
                          field.type === "color" ? "h-24" : ""
                        } ${field.disabled || field.isId ? "bg-gray-200 cursor-not-allowed opacity-70" : ""}`}
                      />
                    )}
                  </div>
                )
              ))}
              </>
              }
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancelar</button>
                {mode === "delete" ? (
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                ) : (
                  <button type="submit" className="px-4 py-2 bg-blue-800 text-white rounded">
                    {mode === "edit" ? "Actualizar" : "Guardar"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    
  );
});

GenericModal.displayName = "GenericModal";

export default GenericModal;
