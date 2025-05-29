"use client"
// SDK de Mercado Pago
import { useEffect } from 'react';
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';

export default function Home() {
  
  useEffect(() => {
    initMercadoPago('TEST-653b1412-a3b9-47ca-91eb-789cf621753c', { locale: 'es-PE' });
  }, []);

  
const initialization = {
  amount: 100,
 };
 
 
 const onSubmit = async (formData: any) => {
  // callback llamado al hacer clic en el botón enviar datos
  return new Promise<void>((resolve, reject) => {
    fetch('/process_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        resolve();
      })
      .catch((error) => {
        // manejar la respuesta de error al intentar crear el pago
        reject();
      });
  });
 };
 
 
 const onError = async (error: any) => {
  // callback llamado para todos los casos de error de Brick
  console.log(error);
 };
 
 
 const onReady = async () => {
  /*
    Callback llamado cuando Brick está listo.
    Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
  */
 };
 
  return (
    <div className="">
      <div className="text-center mt-12 mb-12">
                <h1 className="text-2xl font-semibold">¡Estamos buscando talento!</h1>
                <p className="text-lg mt-2">Si estás listo para el próximo gran paso en tu carrera, esta es tu oportunidad. Descubre más sobre el puesto y únete a nuestro equipo. </p>
            </div>
      <CardPayment
          initialization={initialization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
    </div>
  );
}
