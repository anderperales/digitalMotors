import React, { useState } from "react";
import Link from "next/link";
import { FiDownload } from "react-icons/fi";

interface File {
  url: string;
  type: string;
  publicId: string;
}

interface FileGalleryProps {
  files: File[];
  onClose: () => void;
}

const FileGallery: React.FC<FileGalleryProps> = ({ files, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Estado para llevar el control de la imagen mostrada

  // Funciones para cambiar la imagen principal
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % files.length); // Avanzar al siguiente archivo
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + files.length) % files.length // Retroceder al archivo anterior
    );
  };

  // Bloquear el scroll del body cuando la galería esté abierta
  React.useEffect(() => {
    document.body.style.overflow = "hidden"; // Bloquear el scroll
    return () => {
      document.body.style.overflow = "auto"; // Restaurar el scroll cuando la galería se cierre
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Visualizador de Archivos</h2>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-bold text-xl"
          >
            X
          </button>
        </div>
        <div className="flex flex-col items-center gap-6">
          {/* Imagen principal */}
          <div className="relative w-full max-w-md place-content-center flex">
            <img
              src={files[currentImageIndex].url}
              alt={`Archivo ${currentImageIndex + 1}`}
              className="w-auto h-auto max-h-[50vh] rounded-lg"
            />
            {/* Flechas para navegar entre imágenes */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
            >
              &gt;
            </button>
          </div>

          {/* Miniaturas de las imágenes */}
          <div className="flex gap-4 overflow-x-auto py-4">
            {files.map((file, index) => (
              <div
                key={index}
                className={`cursor-pointer border rounded-lg overflow-hidden text-center self-center ${
                  index === currentImageIndex ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setCurrentImageIndex(index)} // Cambiar la imagen principal al hacer click en la miniatura
              >
                {file.url.endsWith(".jpg") || file.url.endsWith(".png") ? (
                  <img
                    src={file.url}
                    alt={`Archivo ${index + 1}`}
                    className="min-w-24 min-h-24 max-w-24 max-h-24 object-cover"
                  />
                ) : (
                  <Link target="_blank"  className="justify-center text-center align-middle self-center" href={file.url} passHref>
                      <FiDownload className="text-6xl place-self-center"></FiDownload>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileGallery;
