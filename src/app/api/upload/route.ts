import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configura Cloudinary usando variables de entorno sin el prefijo NEXT_PUBLIC_
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Asegúrate de que esté en el entorno
});

const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  // Extrae los archivos del FormData
  const formData = await request.formData();
  const file = formData.get('file') as Blob;

  if (!file) {
    return NextResponse.json({ error: 'No se encontró el archivo' }, { status: 400 });
  }

  // Convierte el Blob a un Buffer que Cloudinary pueda usar
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    // Sube el archivo a Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          throw new Error('Error al subir el archivo a Cloudinary');
        }
        return NextResponse.json(result);
      }
    );

    // Escribe el buffer al stream de Cloudinary
    result.end(buffer);
  } catch (error) {
    return NextResponse.json({ error: 'Error al subir el archivo a Cloudinary' }, { status: 500 });
  }
}
