"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { HiDownload } from 'react-icons/hi';

function CV() {
    const { data: session } = useSession();
    const username = session?.user?.name || '';
    const email = session?.user?.email || '';

    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const [cvUpdatedAt, setCvUpdatedAt] = useState<string | null>(null);

    useEffect(() => {
      // Intenta recuperar la URL del CV desde localStorage
      const storedCvUrl = localStorage.getItem("cvUrl");
      const storedCvUpdatedAt = localStorage.getItem("cvUpdatedAt");

      if (storedCvUrl) {
        setCvUrl(storedCvUrl);
      } else if (session?.user?.cvUrl) {
        // Si hay URL en la sesión, úsala
        setCvUrl(session.user.cvUrl);
      }


    if (storedCvUpdatedAt) {
        setCvUpdatedAt(storedCvUpdatedAt);
      } else if (session?.user?.cvUpdatedAt) {
        // Si hay fecha en la sesión, úsala
        setCvUpdatedAt(session.user.cvUpdatedAt);
      }

    }, [session]);

    const [loading, setLoading] = useState<boolean>(false); // Estado para el loading

    console.log(session);

    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

  const updateCvData = (fileUrl: string) => {
    const currentDateTime = new Date().toISOString(); // Obtener fecha y hora actual
    setCvUrl(fileUrl); // Actualiza el estado local del CV
    setCvUpdatedAt(currentDateTime); // Actualiza la fecha de modificación

    // Guarda la URL y la fecha en localStorage
    localStorage.setItem("cvUrl", fileUrl);
    localStorage.setItem("cvUpdatedAt", currentDateTime);
  };

    // Función para formatear la fecha
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Debe actualizar su CV';
        const date = new Date(dateString);
        return date.toLocaleString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Cambia a true si deseas formato de 12 horas
        });
      };

    const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
        alert('Por favor, selecciona un archivo antes de enviar.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'aguagutis_preset'); // Asegúrate de que este preset exista
    setLoading(true); // Inicia el loading
    
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error desconocido al subir el archivo.');
        }

        const data = await response.json();
        const fileUrl = data.secure_url; // Obtén la nueva URL del archivo subido

        // Actualizar la URL en tu backend
        const updateResponse = await fetch(`/api/cv/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email, // Asegúrate de incluir el email
                cvUrl: fileUrl, // Actualiza para usar la URL correcta
            }),
        });

        if (!updateResponse.ok) {
            const updateErrorData = await updateResponse.json();
            throw new Error(updateErrorData.message || 'Error al actualizar el CV.');
        }
        
        updateCvData(fileUrl);
        
        setFile(null);
        setLoading(false);
        console.log('Archivo subido y nota actualizada exitosamente:', data);
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Error al subir el archivo, verifica la consola para más detalles.');
    }
};

    return (
        <div className="p-8">
            <div className="text-center mb-12">
                <h1 className="text-2xl font-semibold">Mi Curriculum Vitae</h1>
                <p className="text-lg mt-2">En esta sección puedes gestionar tu CV.<br />Archivos válidos: .pdf y .docx</p>
            </div>
            <div className="flex justify-center gap-2.5">
                <div className="flex flex-col gap-1">
                    {
                        (cvUrl) &&
                        <>
                        
                        
                    <div className="flex flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
                        <div className="flex justify-center my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
                        <div className="me-2">
                                <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                                    <svg fill="none" aria-hidden="true" className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 21">
                                        <g clipPath="url(#clip0_3173_1381)">
                                            <path fill="#E2E5E7" d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z" />
                                            <path fill="#B0B7BD" d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z" />
                                            <path fill="#CAD1D8" d="M18.774 9.25l-3.75-3.75h3.75v3.75z" />
                                            <path fill="#F15642" d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z" />
                                            <path fill="#fff" d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z" />
                                            <path fill="#CAD1D8" d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3173_1381">
                                                <path fill="#fff" d="M0 0h20v20H0z" transform="translate(0 .5)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Curriculum Vitae
                                </span>
                                <span className="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                                {formatDate(cvUpdatedAt)}
                                </span>
                            </div>
                        </div>
                        
                    </div>
                        
                        </>
                    }
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <label htmlFor="file-upload" className="relative flex justify-center items-center w-full max-w-[326px] h-10 text-sm text-gray-500 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500 hover:border-gray-400">
                            <span className="p-6 font-semibold text-gray-900 dark:text-white">{file ? file.name : "Selecciona un archivo"}</span>
                            <input id="file-upload" type="file" accept=".pdf, .docx" className="sr-only" onChange={handleFileChange} />
                        </label>
                        <div className="flex justify-end mt-2">
                            <button  disabled={loading || !file} type="submit" className={`h-10 w-full max-w-[326px] rounded-xl ${(loading || !file) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500text-white'}`}>{loading ? 'Cargando...' : 'Actualizar'}</button>
                        </div>
                    </form>
                    <div className="flex justify-end mt-2">
                    <a
                        href={cvUrl || ''} // Cambia a undefined si no hay cvUrl
                        target="_blank"
                        download={cvUrl ? "Curriculum_Vitae.pdf" : ''} // Solo establece el nombre si hay cvUrl
                        className={`h-10 w-full max-w-[326px] rounded-xl flex items-center justify-center ${cvUrl ? 'bg-bramotors-red text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        onClick={(e) => {
                            if (!cvUrl) {
                                e.preventDefault(); // Previene el comportamiento por defecto si no hay cvUrl
                            }
                        }}
                    >
                        {
                            (cvUrl) && 
                            <>
                                <HiDownload className="h-5 w-5 mr-2" />
                            </>
                        }
                        {cvUrl ? 'Descargar CV' : 'CV no disponible'}
                    </a>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default CV;
