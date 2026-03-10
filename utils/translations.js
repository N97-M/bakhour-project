export const translations = {
    en: {
        nav: {
            home: 'Home',
            collection: 'Collection',
            story: 'Our Story',
            packaging: 'Packaging',
            shopNow: 'Shop Now',
            cart: 'Cart',
            viewMore: 'View More'
        },
        hero: {
            title: 'Exquisite Sudanese',
            goldTitle: 'Bakhour',
            subtitle: 'Heritage in every scent.',
            cta: 'Explore Collection',
            quizTitle: 'Find Your Perfect Scent',
            quizText: 'Our AI Scent Advisor analyzes your preferences to find your ideal bakhoor — from warm heritage notes to innovative modern blends.',
            quizCta: 'Take the Quiz'
        },
        quiz: {
            title: 'Scent Advisor',
            subtitle: 'Discover your olfactory signature',
            start: 'Begin Discovery',
            next: 'Next Question',
            resultTitle: 'Our Recommendation',
            resultSubtitle: 'The scent that reflects your essence',
            back: 'Restart Quiz',
            questions: [
                {
                    id: 1,
                    text: 'How would you describe your ideal atmosphere?',
                    options: [
                        { label: 'Calm & Relaxing', value: 'relax' },
                        { label: 'Energetic & Vibrant', value: 'energy' },
                        { label: 'Professional & Bold', value: 'bold' }
                    ]
                },
                {
                    id: 2,
                    text: 'Which scent family do you naturally lean towards?',
                    options: [
                        { label: 'Deep Woody (Oud)', value: 'oud' },
                        { label: 'Warm Sandalwood', value: 'sandal' },
                        { label: 'Soft Floral & Musk', value: 'floral' }
                    ]
                },
                {
                    id: 3,
                    text: 'How intense do you like your fragrance?',
                    options: [
                        { label: 'Subtle & Intimate', value: 'low' },
                        { label: 'Balanced & Noticable', value: 'mid' },
                        { label: 'Strong & Powerful', value: 'high' }
                    ]
                }
            ]
        },
        heritage: {
            title: 'An Olfactory',
            goldTitle: 'Mastery',
            subtitle: 'A scent that tells a story of elegance and authenticity... Luxury that touches the senses.'
        },
        footer: {
            tagline: 'Where heritage becomes fragrance.',
            explore: 'Explore',
            support: 'Contact',
            shipping: 'Shipping & Returns',
            care: 'Care Guide',
            rights: '© 2026 Al Dalal Bakhour. All rights reserved.',
            delivery: 'We ship to all UAE Emirates and GCC countries.'
        },
        story: {
            heroTitle: 'The Essence of',
            heroGoldTitle: 'Sudanese Bakhoor',
            heroSubtitle: 'Crafted with the essence of Sudanese tradition. Aged and refined to perfection — bringing warmth, purity, and a timeless aroma that lingers with elegance.',
            philosophyTitle: 'The Art of',
            philosophyGold: 'Excellence',
            philosophyText1: 'Every fragrance we create is a masterpiece, crafted with passion and precision to touch your soul.',
            philosophyText2: 'At Al Dalal, we believe that luxury is a feeling that transcends time, rooted in purity and heritage.',
            values: ['Authenticity', 'Elegance', 'Heritage', 'Luxury'],
            journeyTitle: 'A Journey of',
            journeyGold: 'Mastery',
            timeline: [
                { title: 'The Vision', text: 'It began with a dream to capture the essence of Sudanese heritage in a single breath.' },
                { title: 'The Craft', text: 'Years of perfecting the secret blends that make Al Dalal unique in its depth.' },
                { title: 'The Expansion', text: 'Sharing our passion for luxury with fragrance lovers across the globe.' }
            ]
        },
        packaging: {
            title: 'The Art of',
            goldTitle: 'Unboxing',
            subtitle: 'Where every detail is crafted to honor the precious gift within.',
            description: 'Our packaging is more than just a box; it is an extension of the heritage we carry. Using premium materials and gold-leaf accents, we ensure that your first encounter with Al Dalal is as memorable as the scent itself.',
            features: [
                { title: 'Pure Silk', desc: 'Inner linings that protect the delicate bakhour.' },
                { title: 'Gold Seal', desc: 'A signature of authenticity and luxury.' },
                { title: 'Hand-Finished', desc: 'Each box is inspected and finished by hand.' }
            ]
        },
        cart: {
            title: 'Your',
            goldTitle: 'Cart',
            itemsCount: 'items in your selection',
            empty: 'Your selection is currently empty.',
            browse: 'Browse Collection',
            summary: 'Order Summary',
            subtotal: 'Subtotal',
            shipping: 'Shipping',
            complimentary: 'Complimentary',
            total: 'Total',
            checkout: 'Proceed to Checkout',
            secure: 'Secure and Encrypted Transaction',
            continue: '← Continue Shopping'
        },
        checkout: {
            title: 'Checkout',
            shipping: 'Shipping Information',
            gift: 'Gift Options',
            confirm: 'Confirm Order',
            success: 'Order Successful',
            thankyou: 'Thank you for choosing Al Dalal. Your order is being prepared with care.'
        },
        products: [
            { id: 1, name: 'Bakhour Al Shaf (500ml)', price: '80 AED', category: 'Heritage', image: '/product-hero.png', notes: 'Sudanese Shaf · Oudh', desc: 'Premium Sudanese Shaf bakhour in 500ml size. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 2, name: 'Bakhour Al Anfar (500ml)', price: '80 AED', category: 'Heritage', image: '/product-hero.png', notes: 'Anfar · Oudh · Amber', desc: 'Elite Al Anfar bakhour blend in a generous 500ml jar. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 3, name: 'Bakhour Habooba (300ml)', price: '80 AED', category: 'Heritage', image: '/product-hero.png', notes: 'Traditonal Grains · Oudh', desc: 'The beloved traditional Habooba scent in 300ml size. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 4, name: 'Al Dalal Mix (300ml)', price: '100 AED', category: 'Signature', image: '/product-hero.png', notes: 'Secret Blend · Oudh · Spices', desc: 'Our signature luxurious mix of the finest bakhour ingredients. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 5, name: 'Sandalwood Balls (300ml)', price: '100 AED', category: 'Sandalwood', image: '/product-hero.png', notes: 'Sandalwood · Musk · Oils', desc: 'Hand-rolled premium sandalwood balls for a lasting fragrance. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 6, name: 'Sandalwood Shavings (300ml)', price: '80 AED', category: 'Sandalwood', image: '/product-hero.png', notes: 'Pure Sandal Shavings', desc: 'High-quality sandalwood shavings, finely prepared for everyday luxury. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 7, name: 'Rooh Al Oud (300ml)', price: '110 AED', category: 'Oud', image: '/product-hero.png', notes: 'Pure Oud · Musk · Amber', desc: 'The soul of wood, a powerful and authentic oud experience. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 8, name: 'Mahlab Mukhamariya (300ml)', price: '100 AED', category: 'Mukhamariya', image: '/product-hero.png', notes: 'Mahlab · Essential Oils', desc: 'Traditional Sudanese hair and body fragrance with mahlab. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 9, name: 'Dhufra Khamra (50ml)', price: '80 AED', category: 'Khumra', image: '/product-hero.png', notes: 'Dhufra · Sandalwood', desc: 'Concentrated Dhufra Khamra, a deep and mysterious heritage scent. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 10, name: 'Musk Khamra (50ml)', price: '80 AED', category: 'Khumra', image: '/product-hero.png', notes: 'Soft Musk · Rose', desc: 'Elegant and soft musk-based concentrated fragrance. Handcrafted with care. Preserve in a cool, dry place.' },
            { id: 11, name: 'Sandalwood Khamra (50ml)', price: '80 AED', category: 'Khumra', image: '/product-hero.png', notes: 'Sandalwood · Essential Oils', desc: 'Warm and inviting sandalwood concentrated essence. Handcrafted with care. Preserve in a cool, dry place.' },
        ]
    },
    ar: {
        nav: {
            home: 'الرئيسية',
            collection: 'التشكيلة',
            story: 'قصتنا',
            packaging: 'تغليفنا',
            shopNow: 'تسوق الآن',
            cart: 'السلة',
            viewMore: 'عرض المزيد'
        },
        hero: {
            title: 'بخور سوداني',
            goldTitle: 'فاخر',
            subtitle: 'تراث في كل نفحة.',
            cta: 'اكتشف التشكيلة',
            quizTitle: 'اكتشف عطرك المثالي',
            quizText: 'مستشار العطور الذكي لدينا يحلل ذوقك الشخصي ليختار لك البخور الذي يعكس شخصيتك — من النفحات التراثية الدافئة إلى الروائح العصرية المبتكرة.',
            quizCta: 'ابدأ الاختبار'
        },
        quiz: {
            title: 'مستشار العطور',
            subtitle: 'اكتشف البصمة العطرية التي تمثلك',
            start: 'ابدأ الرحلة',
            next: 'السؤال التالي',
            resultTitle: 'توصيتنا لك',
            resultSubtitle: 'العطر الذي يعكس جوهر شخصيتك',
            back: 'إعادة الاختبار',
            questions: [
                {
                    id: 1,
                    text: 'كيف تصف الأجواء المثالية بالنسبة لك؟',
                    options: [
                        { label: 'هادئة ومريحة', value: 'relax' },
                        { label: 'حيوية ومليئة بالطاقة', value: 'energy' },
                        { label: 'رسمية وقوية', value: 'bold' }
                    ]
                },
                {
                    id: 2,
                    text: 'أي عائلة عطرية تميل إليها عادةً؟',
                    options: [
                        { label: 'الروائح الخشبية العميقة (عود)', value: 'oud' },
                        { label: 'خشب الصندل الدافئ', value: 'sandal' },
                        { label: 'الزهور والمسك الناعم', value: 'floral' }
                    ]
                },
                {
                    id: 3,
                    text: 'ما هي درجة قوة العطر التي تفضلها؟',
                    options: [
                        { label: 'خفيفة وشخصية', value: 'low' },
                        { label: 'متوازنة وواضحة', value: 'mid' },
                        { label: 'قوية ونفاذة', value: 'high' }
                    ]
                }
            ]
        },
        heritage: {
            title: 'عبيرٌ يروي حكاية',
            goldTitle: 'الأصالة',
            subtitle: 'فخامة تُلامس الحواس'
        },
        footer: {
            tagline: 'حيث يصبح التراث عطراً.',
            explore: 'استكشف',
            support: 'تواصل معنا',
            shipping: 'الشحن والإرجاع',
            care: 'دليل العناية',
            rights: '© 2026 بخور الدلال. جميع الحقوق محفوظة.',
            delivery: 'نشحن لكل إمارات الدولة ودول الخليج'
        },
        story: {
            heroTitle: 'أصل',
            heroGoldTitle: 'البخور السوداني',
            heroSubtitle: 'مصنوع بروح التقاليد السودانية. مُعتّق ومُنقّى بإتقان — ليمنح دفئًا ونقاءً وعطرًا خالدًا يدوم بأناقة.',
            philosophyTitle: 'فن',
            philosophyGold: 'الإتقان',
            philosophyText1: 'كل عطر نصنعه هو لوحة فنية، صيغت بشغف ودقة لتلامس روحك.',
            philosophyText2: 'في بخور الدلال، نؤمن أن الفخامة شعور يتجاوز الزمن، جذوره النقاء والتراث.',
            values: ['أصالة', 'أناقة', 'تراث', 'فخامة'],
            journeyTitle: 'رحلة',
            journeyGold: 'الإبداع',
            timeline: [
                { title: 'الرؤية', text: 'بدأت بحلم لاختزال جوهر التراث السوداني في نفحة واحدة.' },
                { title: 'الحرفة', text: 'سنوات من إتقان الخلطات السرية التي تجعل بخور الدلال فريداً في عمقه.' },
                { title: 'الانتشار', text: 'مشاركة شغفنا بالفخامة مع عشاق العطور في جميع أنحاء العالم.' }
            ]
        },
        packaging: {
            title: 'فن',
            goldTitle: 'التغليف',
            subtitle: 'حيث صُممت كل تفصيل لتكريم الهدية الثمينة بداخلها.',
            description: 'تغليفنا ليس مجرد صندوق؛ بل هو امتداد للتراث الذي نحمله. باستخدام مواد فاخرة ولمسات ذهبية، نضمن أن يكون لقاؤك الأول مع "بخور الدلال" لا يُنسى كالعطر نفسه.',
            features: [
                { title: 'حرير نقي', desc: 'بطانة داخلية تحمي البخور الرقيق.' },
                { title: 'ختم ذهبي', desc: 'بصمة الأصالة والفخامة المعتمدة.' },
                { title: 'لمسة يدوية', desc: 'يتم فحص وتجهيز كل صندوق يدوياً بعناية.' }
            ]
        },
        cart: {
            title: 'عربة',
            goldTitle: 'التسوق',
            itemsCount: 'منتجات في اختيارك',
            empty: 'سلتك فارغة حالياً.',
            browse: 'تصفح التشكيلة',
            summary: 'ملخص الطلب',
            subtotal: 'المجموع الفرعي',
            shipping: 'الشحن',
            complimentary: 'مجاني',
            total: 'المجموع الكلي',
            checkout: 'إتمام الشراء',
            secure: 'معاملة آمنة ومشفرة',
            continue: '← متابعة التسوق'
        },
        checkout: {
            title: 'إتمام الطلب',
            shipping: 'معلومات الشحن',
            gift: 'خيارات الهدايا',
            confirm: 'تأكيد الطلب',
            success: 'تم الطلب بنجاح',
            thankyou: 'شكراً لاختيارك بخور الدلال. سيتم تجهيز طلبك بكل عناية واهتمام.'
        },
        products: [
            { id: 1, name: 'بخور الشاف (٥٠٠ مل)', price: '٨٠ درهم', category: 'تراثي', image: '/product-hero.png', notes: 'شاف سوداني · عود', desc: 'بخور الشاف السوداني الفاخر بحجم ٥٠٠ مل. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 2, name: 'بخور العنفر (٥٠٠ مل)', price: '٨٠ درهم', category: 'تراثي', image: '/product-hero.png', notes: 'عنفر · عود · عنبر', desc: 'مزيج بخور العنفر النخبة بحجم عائلي ٥٠٠ مل. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 3, name: 'بخور حبوبة (٣٠٠ مل)', price: '٨٠ درهم', category: 'تراثي', image: '/product-hero.png', notes: 'حبوب · عود · عنبر', desc: 'بخور حبوبة التراثي الأصيل بعبقه السوداني المحبوب. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 4, name: 'مكس الدلال (٣٠٠ مل)', price: '١٠٠ درهم', category: 'مميز', image: '/product-hero.png', notes: 'خلطة سرية · عود', desc: 'التوليفة الفاخرة التي تمثل توقيع بخور الدلال. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 5, name: 'كرات الصندل (٣٠٠ مل)', price: '١٠٠ درهم', category: 'صندل', image: '/product-hero.png', notes: 'صندل · مسك · زيوت', desc: 'كرات الصندل الفاخرة المشغولة يدوياً لثبات يدوم طويلاً. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 6, name: 'مبشور صندل (٣٠٠ مل)', price: '٨٠ درهم', category: 'صندل', image: '/product-hero.png', notes: 'مبشور صندل نقي', desc: 'رقائق خشب الصندل الفاخرة والمحضرة بعناية للاستخدام اليومي. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 7, name: 'روح العود (٣٠٠ مل)', price: '١١٠ درهم', category: 'عود', image: '/product-hero.png', notes: 'عود نقي · مسك', desc: 'تجربة عطرية عميقة تمثل جوهر الخشب العتيق. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 8, name: 'مخمرية محلب (٣٠٠ مل)', price: '١٠٠ درهم', category: 'مخمرية', image: '/product-hero.png', notes: 'محلب · زيوت أساسية', desc: 'عطر المحلب السوداني التقليدي للجسم والشعر. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 9, name: 'خمرة ضفرة (٥٠ مل)', price: '٨٠ درهم', category: 'خمرة', image: '/product-hero.png', notes: 'ضفرة · صندل', desc: 'خمرة الضفرة المركزة بعبقها التراثي الغامض والعميق. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 10, name: 'خمرة مسك (٥٠ مل)', price: '٨٠ درهم', category: 'خمرة', image: '/product-hero.png', notes: 'مسك ناعم · ورد', desc: 'خمرة المسك الأنيقة والناعمة لرائحة تبعث على الراحة. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
            { id: 11, name: 'خمرة صندل (٥٠ مل)', price: '٨٠ درهم', category: 'خمرة', image: '/product-hero.png', notes: 'صندل · زيوت مركزة', desc: 'جوهر الصندل الدافئ والمنعش في زجاجة مركزة. صُنع يدويًا بعناية. يُحفظ في مكان بارد وجاف.' },
        ]
    }
};
