import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { Resend } from 'resend';

// Initialize later when API keys are available
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    // const body = await req.text();
    // const signature = req.headers.get('stripe-signature');

    try {
        // const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        // Mock parsing the event for now
        const mockEvent = { type: 'checkout.session.completed', data: { object: { customer_email: 'test@example.com', amount_total: 10000 } } };
        const event = mockEvent;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const email = session.customer_email;

            // TODO: Generate Digital Invoice & Order Confirmation
            console.log(`[AUTOMATION] Payment successful for ${email}. Triggering automatic Order Confirmation & Invoice generation via Resend...`);

            /* Example Implementation:
            await resend.emails.send({
                from: 'orders@aldalalbakhour.com',
                to: email,
                subject: 'Your Al Dalal Order Confirmation & Invoice',
                html: '<h1>Thank you for your purchase!</h1><p>Find your digital invoice attached.</p>',
                // attachments: [ { filename: 'invoice.pdf', content: generatedPdfBuffer } ]
            });
            */
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
    }
}
