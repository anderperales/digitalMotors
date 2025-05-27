// src/app/page.tsx
import { MercadoPagoConfig, Preference } from 'mercadopago';
const client = new MercadoPagoConfig({ accessToken: 'YOUR_ACCESS_TOKEN' });

const preference = new Preference(client);

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

initMercadoPago('YOUR_PUBLIC_KEY');

preference.create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 1,
        unit_price: 20,
        id: '<ID>',
      }
    ],
  }
})
.then(console.log)
.catch(console.log);
