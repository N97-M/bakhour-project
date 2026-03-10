import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// import { Resend } from 'resend';
// import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
    try {
        const body = await req.json();
        const { productName, productUrl } = body;

        // NOTE: Validate admin key here to ensure only admins can trigger this endpoint

        // 1. Fetch subscribed users from database
        // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        // const { data: users } = await supabase.from('Users').select('email').eq('wants_newsletter', true);

        const mockSubscribers = ['user1@example.com', 'user2@example.com'];

        console.log(`[AUTOMATION] Admin added new product: ${productName}. Sending notification email to all subscribed users (${mockSubscribers.length} total)...`);

        // 2. Send email to subscribers
        for (const email of mockSubscribers) {
            await resend.emails.send({
                from: 'updates@aldalalbakhour.com',
                to: email,
                subject: `New Arrival: ${productName}`,
                html: `<p>Discover our latest masterpiece: <a href="${productUrl}">${productName}</a></p>`
            });
        }

        return NextResponse.json({ success: true, message: `Notifications sent for ${productName}` });
    } catch (error) {
        console.error('Error triggering product notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
