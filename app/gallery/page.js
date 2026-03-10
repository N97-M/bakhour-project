'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';
import { flyToCart } from '@/utils/flyToCart';

const ProductHero = dynamic(() => import('@/components/ui/ProductHero'), { ssr: false });

export default function GalleryPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const { lang } = useLanguage();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                // Map DB fields to what components expect
                const mapped = data.map(p => ({
                    ...p,
                    name: lang === 'en' ? p.name_en : p.name_ar,
                    price: `${p.price} AED`,
                    category: lang === 'en' ? p.category_en : p.category_ar,
                    image: p.image_url
                }));
                setProducts(mapped);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [lang]);

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.sceneWrapper}>
                        <ProductHero />
                    </div>
                    <div className={styles.headerContent}>
                        <p className={styles.overline}>{lang === 'en' ? 'Full Collection' : 'التشكيلة الكاملة'}</p>
                        <h1 className={styles.title}>
                            {lang === 'en' ? 'The ' : ''}
                            <span className="gold-text">{lang === 'en' ? 'Bakhour' : 'بخور'}</span>
                            {lang === 'en' ? ' Gallery' : ' الدلال'}
                        </h1>
                        <span className="gold-divider" />
                    </div>
                </div>

                {/* Product Grid */}
                <section className={`${styles.grid} section-padding`}>
                    <div className="container">
                        {loading ? (
                            <div className="gold-text" style={{ textAlign: 'center', padding: '4rem' }}>
                                {lang === 'en' ? 'Unveiling the collection...' : 'جاري عرض التشكيلة...'}
                            </div>
                        ) : (
                            <div className={styles.products}>
                                {products.map((p, i) => (
                                    <div
                                        key={p.id}
                                        className={styles.card}
                                        onClick={() => router.push(`/products/${p.id}`)}
                                        style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer' }}
                                    >
                                        <div className={styles.cardImageWrapper}>
                                            <img src={p.image} alt={p.name} className={styles.cardImage} />
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h2 className={styles.cardName}>{p.name}</h2>
                                            <p className={styles.cardPrice}>{p.price}</p>
                                            <button
                                                className={`btn-luxury ${styles.addToCartBtn}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(p);
                                                    flyToCart(e);
                                                }}
                                            >
                                                <span>{translations[lang].nav.cart}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
