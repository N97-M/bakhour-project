import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(req) {
    try {
        const body = await req.json();
        console.log('[ZIINA WEBHOOK] Received event:', JSON.stringify(body));

        const event = body.event || body.type;
        const data = body.data || body;
        const paymentIntent = data.payment_intent || data;

        const paymentIntentId = paymentIntent?.id;
        const status = paymentIntent?.status;
        const orderId = paymentIntent?.metadata?.order_id || body.order_id;

        if (status === 'completed' || event === 'payment_intent.completed') {
            if (orderId) {
                const { error } = await supabase
                    .from('orders')
                    .update({
                        status: 'processing',
                        ziina_status: 'completed'
                    })
                    .eq('id', orderId);

                if (error) {
                    console.error('[ZIINA WEBHOOK] Error updating order status:', error);
                } else {
                    console.log(`[ZIINA WEBHOOK] Order ${orderId} successfully marked as processing.`);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('[ZIINA WEBHOOK] Error:', err.message);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
    }
}
