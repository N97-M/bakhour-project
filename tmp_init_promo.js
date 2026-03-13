
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.join('=').trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function init() {
    const promoPopup = {
        active: true,
        title_en: "10% Discount on Your First Order",
        title_ar: "خصم ١٠٪ على طلبك الأول",
        text_en: "Use this promo code at checkout",
        text_ar: "استخدم كود الخصم هذا عند الدفع",
        code: "FIRST10",
        discount: 10
    };

    console.log("Initializing promo_popup in site_config...");
    const { data, error } = await supabase
        .from('site_config')
        .upsert({ key: 'promo_popup', value: promoPopup });

    if (error) {
        console.error("Error initializing promo_popup:", error);
    } else {
        console.log("promo_popup initialized successfully!");
    }

    // Also ensure the coupon exists in the coupons table
    console.log("Ensuring coupon FIRST10 exists...");
    const { error: couponError } = await supabase
        .from('coupons')
        .upsert({
            code: 'FIRST10',
            discount_type: 'percentage',
            discount_value: 10,
            active: true,
            min_order_value: 0
        }, { onConflict: 'code' });

    if (couponError) {
        console.error("Error creating coupon:", couponError);
    } else {
        console.log("Coupon FIRST10 ready!");
    }
}

init();
