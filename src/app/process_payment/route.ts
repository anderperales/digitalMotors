import MercadoPagoConfig, { Payment } from "mercadopago";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { token, payment_method_id, transaction_amount, payer, installments } = await request.json();

        const client = new MercadoPagoConfig({ accessToken: 'TEST-3138225088538281-101619-90e98415b22dc1ab967770a48be98d3c-1864589980', options: { timeout: 5000 } });

        const payment = new Payment(client);
        
        payment.create({ body: {
          token: token,
          transaction_amount: transaction_amount,
          description: 'libro',
          payment_method_id: payment_method_id,
          payer: payer,
          installments: installments
        } }).then(console.log).catch(console.log);
            return NextResponse.json(200);
        } catch (error) {
            console.log(error);
        }
}
