-- MIGRATE PRODUCTS FROM translations.js TO DATABASE
-- Run this AFTER admin_schema.sql

-- Clear existing products to prevent duplicates during testing
TRUNCATE TABLE public.products RESTART IDENTITY CASCADE;

INSERT INTO public.products (id, name_en, name_ar, price, category_en, category_ar, notes_en, notes_ar, desc_en, desc_ar, image_url, is_featured) VALUES
(1, 'Bakhour Al Shaf (500ml)', 'بخور الشاف (٥٠٠ مل)', 80, 'Heritage', 'تراثي', 'Sudanese Shaf · Oudh', 'شاف سوداني · عود', 'Premium Sudanese Shaf bakhour in 500ml size. Handcrafted with care.', 'بخور الشاف السوداني الفاخر بحجم ٥٠٠ مل. صُنع يدويًا بعناية.', '/product-hero.png', true),
(2, 'Bakhour Al Anfar (500ml)', 'بخور العنفر (٥٠٠ مل)', 80, 'Heritage', 'تراثي', 'Anfar · Oudh · Amber', 'عنفر · عود · عنبر', 'Elite Al Anfar bakhour blend in a generous 500ml jar.', 'مزيج بخور العنفر النخبة بحجم عائللي ٥٠٠ مل. صُنع يدويًا بعناية.', '/product-hero.png', true),
(3, 'Bakhour Habooba (300ml)', 'بخور حبوبة (٣٠٠ مل)', 80, 'Heritage', 'تراثي', 'Traditonal Grains · Oudh', 'حبوب · عود · عنبر', 'The beloved traditional Habooba scent in 300ml size.', 'بخور حبوبة التراثي الأصيل بعبقه السوداني المحبوب. صُنع يدويًا بعناية.', '/product-hero.png', true),
(4, 'Al Dalal Mix (300ml)', 'مكس الدلال (٣٠٠ مل)', 100, 'Signature', 'مميز', 'Secret Blend · Oudh · Spices', 'خلطة سرية · عود', 'Our signature luxurious mix of the finest bakhour ingredients.', 'التوليفة الفاخرة التي تمثل توقيع بخور الدلال. صُنع يدويًا بعناية.', '/product-hero.png', true),
(5, 'Sandalwood Balls (300ml)', 'كرات الصندل (٣٠٠ مل)', 100, 'Sandalwood', 'صندل', 'Sandalwood · Musk · Oils', 'صندل · مسك · زيوت', 'Hand-rolled premium sandalwood balls for a lasting fragrance.', 'كرات الصندل الفاخرة المشغولة يدوياً لثبات يدوم طويلاً. صُنع يدويًا بعناية.', '/product-hero.png', false),
(6, 'Sandalwood Shavings (300ml)', 'مبشور صندل (٣٠٠ مل)', 80, 'Sandalwood', 'صندل', 'Pure Sandal Shavings', 'مبشور صندل نقي', 'High-quality sandalwood shavings, finely prepared for everyday luxury.', 'رقائق خشب الصندل الفاخرة والمحضرة بعناية للاستخدام اليومي. صُنع يدويًا بعناية.', '/product-hero.png', false),
(7, 'Rooh Al Oud (300ml)', 'روح العود (٣٠٠ مل)', 110, 'Oud', 'عود', 'Pure Oud · Musk · Amber', 'عود نقي · مسك', 'The soul of wood, a powerful and authentic oud experience.', 'تجربة عطرية عميقة تمثل جوهر الخشب العتيق. صُنع يدويًا بعناية.', '/product-hero.png', false),
(8, 'Mahlab Mukhamariya (300ml)', 'مخمرية محلب (٣٠٠ مل)', 100, 'Mukhamariya', 'مخمرية', 'Mahlab · Essential Oils', 'محلب · زيوت أساسية', 'Traditional Sudanese hair and body fragrance with mahlab.', 'عطر المحلب السوداني التقليدي للجسم والشعر. صُنع يدويًا بعناية.', '/product-hero.png', false),
(9, 'Dhufra Khamra (50ml)', 'خمرة ضفرة (٥٠ مل)', 80, 'Khumra', 'خمرة', 'Dhufra · Sandalwood', 'ضفرة · صندل', 'Concentrated Dhufra Khamra, a deep and mysterious heritage scent.', 'خمرة الضفرة المركزة بعبقها التراثي الغامض والعميق. صُنع يدويًا بعناية.', '/product-hero.png', false),
(10, 'Musk Khamra (50ml)', 'خمرة مسك (٥٠ مل)', 80, 'Khumra', 'خمرة', 'Soft Musk · Rose', 'مسك ناعم · ورد', 'Elegant and soft musk-based concentrated fragrance.', 'خمرة المسك الأنيقة والناعمة لرائحة تبعث على الراحة. صُنع يدويًا بعناية.', '/product-hero.png', false),
(11, 'Sandalwood Khamra (50ml)', 'خمرة صندل (٥٠ مل)', 80, 'Khumra', 'خمرة', 'Sandalwood · Essential Oils', 'صندل · زيوت مركزة', 'Warm and inviting sandalwood concentrated essence.', 'جوهر الصندل الدافئ والمنعش في زجاجة مركزة. صُنع يدويًا بعناية.', '/product-hero.png', false);

-- INITIALIZE SITE CONFIG
INSERT INTO public.site_config (key, value) VALUES
('whatsapp', '{"number": "971500000000", "enabled": true}'),
('announcement', '{"text_en": "Free shipping on orders over 500 AED", "text_ar": "شحن مجاني للطلبات فوق ٥٠٠ درهم", "active": true}'),
('currency', '{"default": "AED", "rates": {"SAR": 1.02, "QAR": 0.99}}');
