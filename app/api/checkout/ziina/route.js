import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request) {
    try {
        const body = await request.json();
        // 1. Get origin for redirect URLs
        const origin = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || 'https://aldalalbakhour.com';

        // 2. Create Order in Supabase
        const { form, cart, finalTotal, shippingCost, appliedCoupon } = body;

        if (!cart || cart.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // --- FIRST ORDER DISCOUNT VALIDATION ---
        if (appliedCoupon) {
            const { data: promoConfig } = await supabase.from('site_config').select('*').eq('key', 'promo_popup').single();
            const promoCode = promoConfig?.value?.code;

            if (promoCode && appliedCoupon.code.toUpperCase() === promoCode.toUpperCase()) {
                // Check for existing orders with this email
                const { data: existingOrders, error: checkError } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('customer_email', form.email.trim())
                    .neq('ziina_status', 'failed') // Ignore failed attempts if necessary
                    .limit(1);

                if (existingOrders && existingOrders.length > 0) {
                    return NextResponse.json({ 
                        error: 'This promo code is valid for first-time purchases only.' 
                    }, { status: 400 });
                }
            }
        }
        // ---------------------------------------

        // Generate a unique order tracking ID
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

        const insertPayload = {
            id: orderId,
            user_id: null, // Depending on if we extract session on server side, let's keep it null for guest or pass it from client
            customer_name: form.name,
            customer_email: form.email,
            customer_phone: form.phone,
            shipping_address: `${form.address}, ${form.city}, ${form.country}`,
            total_amount: finalTotal,
            shipping_cost: shippingCost, // Add shipping cost
            is_gift: form.is_gift,
            gift_message: form.is_gift ? form.gift_message : null,
            status: 'pending',
            ziina_status: 'pending'
        };

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([insertPayload])
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Order Items
        const orderItems = cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: parseFloat(item.price.replace(/[^0-9.]/g, ''))
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 4. Create Ziina Payment Intent
        const ziinaAmount = Math.round(finalTotal * 100); // Ziina expects amount in minor units (fils)

        const ziinaPayload = {
            amount: ziinaAmount,
            currency_code: 'AED',
            success_url: `${origin}/checkout/success?orderId=${order.id}&session_id={PAYMENT_INTENT_ID}`,
            cancel_url: `${origin}/checkout`,
            test: false // We assume this is a live key
        };

        const ziinaResponse = await fetch('https://api-v2.ziina.com/api/payment_intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ZIINA_API_KEY}`
            },
            body: JSON.stringify(ziinaPayload)
        });

        if (!ziinaResponse.ok) {
            const err = await ziinaResponse.text();
            console.error('Ziina API Error:', err);
            throw new Error(`Payment Gateway Error: ${err}`);
        }

        const ziinaData = await ziinaResponse.json();

        // 5. Return the redirect URL to the client
        return NextResponse.json({ url: ziinaData.redirect_url, orderId: order.id });

    } catch (error) {
        console.error('Checkout API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
