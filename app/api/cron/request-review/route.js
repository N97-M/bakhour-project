import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
    try {
        // In a real app, query Supabase for orders delivered exactly 7 days ago
        // where review_requested = false
        // For demonstration, we use a mock order:
        const mockDeliveredOrders = [
            {
                order_id: 'ord_123',
                user_email: 'customer@example.com',
                user_name: 'Ahmed',
                product_name: 'Bakhour Al Shaf (500ml)',
                product_id: 1,
            }
        ];

        if (mockDeliveredOrders.length > 0) {
            for (const order of mockDeliveredOrders) {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // Use a verified domain in production
                    to: order.user_email,
                    subject: 'How are you enjoying Al Dalal Bakhour?',
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a;">
                            <h2 style="color: #C6A75E;">Hello ${order.user_name},</h2>
                            <p>We hope you are enjoying your recent purchase of <strong>${order.product_name}</strong>.</p>
                            <p>As a valued member of the Al Dalal family, your opinion means the world to us. We would love to hear about your experience.</p>
                            <a href="https://yourwebsite.com/products/${order.product_id}?review=true" style="display: inline-block; padding: 12px 24px; background-color: #C6A75E; color: white; text-decoration: none; margin-top: 15px; border-radius: 4px;">Leave a Review</a>
                        </div>
                    `
                });

                // TODO: Update the order in the database to mark review_requested = true
                console.log(`[AUTOMATION] Sent review request email to: ${order.user_email} for product ${order.product_id}`);
            }
        }

        return NextResponse.json({ message: 'Review request emails sent', processed: mockDeliveredOrders.length });
    } catch (error) {
        console.error('Review request cron failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
