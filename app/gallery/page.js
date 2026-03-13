'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';
import { flyToCart } from '@/utils/flyToCart';
import Image from 'next/image';

const ProductHero = dynamic(() => import('@/components/ui/ProductHero'), { ssr: false });

function GalleryContent() {
    const router = useRouter();
    const { addToCart } = useCart();
    const { lang } = useLanguage();
    const [products, setProducts] = useState([]);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const filterCategory = searchParams.get('category') || 'all';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setAllData(data);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = allData;
        if (filterCategory !== 'all') {
            filtered = allData.filter(p => {
                const catsEn = (p.category_en || '').toLowerCase().split(',').map(s => s.trim());
                
                const matches = (allowedCats) => catsEn.some(c => allowedCats.includes(c));

                if (filterCategory === 'bakhour') return matches(['heritage', 'signature', 'sandalwood', 'oud', 'bakhour']);
                if (filterCategory === 'khamriyat') return matches(['khumra', 'khamriyat', 'khomrah']);
                if (filterCategory === 'mahlab') return matches(['mukhamariya', 'mahlab']);
                if (filterCategory === 'gifts') return matches(['gift', 'gifts', 'package', 'packages', 'packages & gifts']);
                if (filterCategory === 'bestSellers') return p.is_featured === true;
                return true;
            });
        }
        
        const mapped = filtered.map(p => ({
            ...p,
            name: lang === 'en' ? p.name_en : p.name_ar,
            price: `${p.price} AED`,
            category: lang === 'en' ? p.category_en : p.category_ar,
            image: p.image_url
        }));
        setProducts(mapped);
    }, [allData, filterCategory, lang]);

    const getCategoryTitle = () => {
        if (filterCategory === 'bakhour') return lang === 'en' ? 'Bakhour' : 'البخور';
        if (filterCategory === 'khamriyat') return lang === 'en' ? 'Khomrah' : 'الخمر';
        if (filterCategory === 'mahlab') return lang === 'en' ? 'Mahlab' : 'محلب';
        if (filterCategory === 'gifts') return lang === 'en' ? 'Packages & Gifts' : 'البكجات والهدايا';
        if (filterCategory === 'bestSellers') return lang === 'en' ? 'Best Sellers' : 'الأكثر مبيعاً';
        return lang === 'en' ? 'Full Collection' : 'التشكيلة الكاملة';
    };

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
                        <p className={styles.overline}>{lang === 'en' ? 'Curated Selection' : 'مختاراتنا'}</p>
                        <h1 className={styles.title}>
                            <span className="gold-text">{getCategoryTitle()}</span>
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
                                            <Image
                                                src={p.image_url || '/product-hero.png'}
                                                alt={p.name_en}
                                                width={400}
                                                height={400}
                                                className={styles.cardImage}
                                            />
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h2 className={styles.cardName}>{p.name}</h2>
                                            {p.size_ml && (
                                                <p className={styles.cardSize}>{p.size_ml} ml</p>
                                            )}
                                            <div className={styles.priceRow}>
                                                <p className={styles.cardPrice}>{p.price}</p>
                                            </div>
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

export default function GalleryPage() {
    return (
        <Suspense fallback={<div className="gold-text" style={{ textAlign: 'center', padding: '4rem' }}>Loading collection...</div>}>
            <GalleryContent />
        </Suspense>
    );
}
