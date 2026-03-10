import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// This endpoint is meant to be called periodically (e.g., hourly) by a service like Vercel Cron.
export async function GET(req) {
    try {
        // Authenticate the cron request to ensure external actors cannot trigger it
        /*
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }
        */

        console.log('[AUTOMATION] Running Cron Job: Checking for Abandoned Carts...');

        // 1. Query the database for carts that have items, are 24+ hours old, and haven't triggered an email yet
        /*
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: abandonedCarts } = await supabase
            .from('Carts')
            .select(`
                id,
                user_email,
                items,
                updated_at
            `)
            .lte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
            .eq('reminder_sent', false);
        */
        const mockAbandonedCarts = [
            { id: 1, user_email: 'forgotful@example.com', items: 2 }
        ];

        // 2. Send reminder emails
        if (mockAbandonedCarts.length > 0) {
            console.log(`[AUTOMATION] Found ${mockAbandonedCarts.length} abandoned carts. Sending reminder emails...`);
            /*
            const resend = new Resend(process.env.RESEND_API_KEY);
            for (const cart of mockAbandonedCarts) {
                await resend.emails.send({
                    from: 'team@aldalalbakhour.com',
                    to: cart.user_email,
                    subject: 'You left something behind at Al Dalal Bakhour',
                    html: `<p>Your luxury incense is waiting for you in your cart.</p>`
                });
                
                // Mark reminder as sent in DB
                await supabase.from('Carts').update({ reminder_sent: true }).eq('id', cart.id);
            }
            */
            // 3. For each abandoned cart owner, send an email
            for (const user of mockAbandonedCarts) {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: user.email,
                    subject: 'You left something behind at Al Dalal Bakhour',
                    html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a;">
                        <h1 style="color: #C6A75E;">Hello ${user.name},</h1>
                        <p>We noticed you left some luxurious items in your cart.</p>
                        <p>Our heritage bakhour blends are waiting for you. Complete your purchase now to secure your selection before it sells out.</p>
                        <a href="https://yourwebsite.com/cart" style="display: inline-block; padding: 12px 24px; background-color: #C6A75E; color: white; text-decoration: none; margin-top: 15px;">Return to Cart</a>
                    </div>
                `
                });
            }
        } else {
            console.log('[AUTOMATION] No abandoned carts found.');
        }

        return NextResponse.json({ message: 'Abandoned cart reminders sent via Resend', processed: mockAbandonedCarts.length });
    } catch (error) {
        console.error('Abandoned cart cron failed:', error);
        return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
    }
}
