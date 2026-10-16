import { NextResponse } from 'next/server';
import { supabase as supabaseAdmin } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

// GET — fetch all countries (used publicly by checkout)
export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('countries')
        .select('*')
        .order('name', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST — create new country (admin only)
export async function POST(req) {
    const body = await req.json();
    const { name, code, shipping_price, is_active } = body;

    if (!name || !code) {
        return NextResponse.json({ error: 'Name and code are required.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from('countries')
        .insert([{ name, code: code.toUpperCase(), shipping_price: Number(shipping_price) || 0, is_active: is_active ?? true }])
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// PUT — update existing country (admin only)
export async function PUT(req) {
    const body = await req.json();
    const { id, name, code, shipping_price, is_active } = body;

    if (!id) return NextResponse.json({ error: 'ID is required.' }, { status: 400 });

    const { data, error } = await supabaseAdmin
        .from('countries')
        .update({ name, code: code?.toUpperCase(), shipping_price: Number(shipping_price) || 0, is_active })
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Keep site_config in sync if UAE is updated
    if (code?.toUpperCase() === 'AE' || name === 'United Arab Emirates') {
        try {
            await supabaseAdmin
                .from('site_config')
                .upsert({ key: 'shipping_uae_flat', value: String(shipping_price) });
        } catch (scErr) {
            console.error('Error syncing site_config:', scErr);
        }
    }

    return NextResponse.json(data);
}

// DELETE — delete a country (admin only)
export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required.' }, { status: 400 });

    const { error } = await supabaseAdmin.from('countries').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
