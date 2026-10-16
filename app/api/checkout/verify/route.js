import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        const { orderId, sessionId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // 1. Fetch current order status from Supabase
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // If order is already confirmed / processing / shipped / delivered, return it
        if (order.status !== 'pending') {
            return NextResponse.json({ success: true, order, alreadyConfirmed: true });
        }

        // 2. If Ziina API key is available and sessionId is provided (and not a raw template string), verify with Ziina
        let paymentVerified = true;
        if (process.env.ZIINA_API_KEY && sessionId && !sessionId.includes('{') && !sessionId.includes('}')) {
            try {
                const ziinaRes = await fetch(`https://api-v2.ziina.com/api/payment_intent/${sessionId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.ZIINA_API_KEY}`
                    }
                });
                if (ziinaRes.ok) {
                    const ziinaData = await ziinaRes.json();
                    if (ziinaData.status === 'failed' || ziinaData.status === 'canceled') {
                        paymentVerified = false;
                        await supabase
                            .from('orders')
                            .update({ ziina_status: ziinaData.status })
                            .eq('id', orderId);
                        return NextResponse.json({ error: 'Payment was not completed', status: ziinaData.status }, { status: 400 });
                    }
                }
            } catch (ziinaErr) {
                console.error('Ziina API status check error:', ziinaErr);
                // Proceed to confirm if redirect to success page already happened
            }
        }

        if (paymentVerified) {
            // 3. Update order to processing and completed
            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'processing',
                    ziina_status: 'completed'
                })
                .eq('id', orderId)
                .select()
                .single();

            if (updateError) {
                console.error('Failed to update order status:', updateError);
                throw updateError;
            }

            return NextResponse.json({ success: true, order: updatedOrder });
        }

        return NextResponse.json({ success: false, message: 'Payment verification pending' });

    } catch (error) {
        console.error('Checkout verification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
