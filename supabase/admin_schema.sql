-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category_en TEXT,
    category_ar TEXT,
    image_url TEXT DEFAULT '/product-hero.png',
    notes_en TEXT,
    notes_ar TEXT,
    desc_en TEXT,
    desc_ar TEXT,
    stock_quantity INTEGER DEFAULT 10,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled
    shipping_address TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    is_gift BOOLEAN DEFAULT false,
    gift_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL
);

-- 5. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_order_value NUMERIC DEFAULT 0,
    active BOOLEAN DEFAULT true,
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SITE CONFIGURATION
CREATE TABLE IF NOT EXISTS public.site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

-- 7. ENABLE RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- 8. PUBLIC POLICIES
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Products" ON public.products;
    DROP POLICY IF EXISTS "Public Read Config" ON public.site_config;
    DROP POLICY IF EXISTS "Public Create Orders" ON public.orders;
    DROP POLICY IF EXISTS "Public Create Order Items" ON public.order_items;
    DROP POLICY IF EXISTS "Users Read Own Orders" ON public.orders;
END $$;

CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users Read Own Orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- 9. ADMIN POLICIES
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Admins manage all" ON public.products;
    DROP POLICY IF EXISTS "Admins manage orders" ON public.orders;
    DROP POLICY IF EXISTS "Admins manage order_items" ON public.order_items;
    DROP POLICY IF EXISTS "Admins manage coupons" ON public.coupons;
    DROP POLICY IF EXISTS "Admins manage config" ON public.site_config;
END $$;

CREATE POLICY "Admins manage all" ON public.products FOR ALL
    USING (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'));
CREATE POLICY "Admins manage orders" ON public.orders FOR ALL
    USING (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'));
CREATE POLICY "Admins manage order_items" ON public.order_items FOR ALL
    USING (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'));
CREATE POLICY "Admins manage coupons" ON public.coupons FOR ALL
    USING (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'));
CREATE POLICY "Admins manage config" ON public.site_config FOR ALL
    USING (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
    WITH CHECK (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'));

-- 10. STORAGE POLICIES (Run these after creating the 'products' bucket in the UI)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
    DROP POLICY IF EXISTS "Admins manage product images" ON storage.objects;
END $$;

-- Allow Public access to read product images
CREATE POLICY "Public Read Product Images" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Allow Admins to manage everything in the 'products' bucket
CREATE POLICY "Admins manage product images" ON storage.objects FOR ALL USING (
    bucket_id = 'products' AND 
    (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
) WITH CHECK (
    bucket_id = 'products' AND 
    (auth.jwt() ->> 'email' IN ('aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'))
);
