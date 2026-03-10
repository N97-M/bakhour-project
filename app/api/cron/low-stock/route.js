import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
    try {
        console.log('[AUTOMATION] Running Cron Job: Checking for Low Stock...');

        // 1. Find products where stock is critically low (e.g., < 5)
        /*
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        const { data: lowStockProducts } = await supabase
            .from('Products')
            .select('id, name, stock')
            .lt('stock', 5);
        */
        const mockLowStockProducts = [
            { id: '1', name: 'Rooh Al Oud', stock: 2 }
        ];

        // 2. Alert Admin
        // 3. Email the admin if there are low stock items
        if (mockLowStockProducts.length > 0) {
            const itemList = mockLowStockProducts.map(item => `<li>${item.name} (- ${item.stock} left)</li>`).join('');

            // Automatically switch emails based on the environment (Local vs Vercel/Domain)
            const adminEmail = process.env.NODE_ENV === 'production'
                ? 'aldalalbakhour@gmail.com'
                : 'monzerhafiz83@gmail.com';

            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: adminEmail,
                subject: 'URGENT: Low Stock Alert - Al Dalal',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #ff4444;">Inventory Alert</h2>
                        <p>The following items are running critically low on stock:</p>
                        <ul>
                            ${itemList}
                        </ul>
                        <p>Please restock these items in the database as soon as possible.</p>
                    </div>
                `
            });
        }

        return NextResponse.json({ success: true, alerted: mockLowStockProducts.length > 0 });
    } catch (error) {
        console.error('Low stock alert failed:', error);
        return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
    }
}
