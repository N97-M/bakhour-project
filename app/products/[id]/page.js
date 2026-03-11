'use client';
import { use, useEffect, useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import ProductReviews from '@/components/ui/ProductReviews';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import { flyToCart } from '@/utils/flyToCart';
import styles from './page.module.css';

export default function ProductPage({ params }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;

    const { lang } = useLanguage();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setProduct({
                    ...data,
                    name: lang === 'en' ? data.name_en : data.name_ar,
                    price: `${data.price} AED`,
                    category: lang === 'en' ? data.category_en : data.category_ar,
                    notes: lang === 'en' ? data.notes_en : data.notes_ar,
                    desc: lang === 'en' ? data.desc_en : data.desc_ar,
                    image: data.image_url
                });
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id, lang]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="gold-text">{lang === 'en' ? 'Preparing the essence...' : 'جاري تحضير التفاصيل...'}</div>
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <main className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h1>{lang === 'en' ? 'Product Not Found' : 'المنتج غير موجود'}</h1>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main>
                {/* Product Detail Section */}
                <section className={styles.productDetails}>
                    <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

                        <div className={styles.imagePlaceholder}>
                            <Image
                                src={product.image || '/product-hero.png'}
                                alt={product.name}
                                width={800}
                                height={1000}
                                className={styles.mainImage}
                                priority
                            />
                            <div className={styles.imageGlow} />
                        </div>

                        <div className={styles.info}>
                            <p className={styles.category}>{product.category}</p>
                            <h1 className={styles.title}>{product.name}</h1>
                            <p className={styles.price}>{product.price}</p>

                            <span className="gold-divider" style={{ margin: '2rem 0', marginLeft: 0 }} />

                            <p className={styles.notes}><strong>{lang === 'en' ? 'Notes:' : 'المكونات:'}</strong> {product.notes}</p>
                            <p className={styles.desc}>{product.desc}</p>

                            <button
                                className={`btn-luxury ${styles.addBtn}`}
                                onClick={(e) => {
                                    addToCart(product);
                                    flyToCart(e);
                                }}
                            >
                                <span>{translations[lang].nav.cart}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <ProductReviews productId={product.id} />
            </main>
            <Footer />
        </>
    );
}
