'use client';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import { useRouter } from 'next/navigation';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import styles from './page.module.css';
import { flyToCart } from '@/utils/flyToCart';

function FeaturedCard({ product, index }) {
    const ref = useRef(null);
    const { addToCart } = useCart();
    const { lang } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) el.classList.add(styles.visible); },
            { threshold: 0.2 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={styles.productCard}
            style={{ transitionDelay: `${index * 0.15}s`, cursor: 'pointer' }}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <div className={styles.cardImageWrapper}>
                <Image
                    src={product.image || '/product-hero.png'}
                    alt={product.name}
                    width={400}
                    height={400}
                    className={styles.cardImage}
                />
            </div>
            <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{product.name}</h3>
                <p className={styles.price}>{product.price}</p>
                <button
                    className={`${styles.addBtn} btn-luxury`}
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        flyToCart(e);
                    }}
                >
                    <span>{translations[lang].nav.cart}</span>
                </button>
            </div>
        </div>
    );
}

export default function Home() {
    const sectionRef = useRef(null);
    const { lang } = useLanguage();
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const t = translations[lang];

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_featured', true)
                .limit(4);

            if (data) {
                const mapped = data.map(p => ({
                    ...p,
                    name: lang === 'en' ? p.name_en : p.name_ar,
                    price: `${p.price} AED`,
                    image: p.image_url
                }));
                setFeatured(mapped);
            }
            setLoading(false);
        };
        fetchFeatured();
    }, [lang]);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) el.classList.add(styles.sectionVisible); },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Navbar />
            <main>
                {/* ── Hero ── */}
                <Hero />

                {/* ── Featured Collection ── */}
                <section className={`${styles.featured} section-padding`} ref={sectionRef}>
                    <div className="container">
                        <div className={styles.sectionHeader}>
                            <p className={styles.overline}>{lang === 'en' ? 'Curated for You' : 'مختارات لأجلك'}</p>
                            <h2 className={styles.sectionTitle}>
                                {lang === 'en' ? 'The ' : ''}
                                <span className="gold-text">{lang === 'en' ? 'Collection' : 'التشكيلة'}</span>
                            </h2>
                            <span className="gold-divider" />
                        </div>

                        {loading ? (
                            <div className="gold-text" style={{ textAlign: 'center', padding: '2rem' }}>
                                {lang === 'en' ? 'Discovering treasures...' : 'جاري عرض المجموعات المميزة...'}
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {featured.map((p, i) => (
                                    <FeaturedCard key={p.id} product={p} index={i} />
                                ))}
                                {featured.length === 0 && (
                                    <p className="gold-text" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                                        {lang === 'en' ? 'More treasures coming soon.' : 'المزيد من الروائع قريباً.'}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className={styles.viewMoreWrapper}>
                            <Link href="/gallery" className="btn-luxury">
                                <span>{t.nav.viewMore}</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── Heritage Banner ── */}
                <section className={styles.heritageBanner}>
                    <div className={styles.heritageOverlay} />
                    <div className={styles.heritageContent}>
                        <p className={styles.overline}>{lang === 'en' ? 'Heritage · Luxury · Art' : 'تراث · فخامة · فن'}</p>
                        <h2 className={styles.heritageTitle}>
                            {t.heritage.title}{' '}
                            <span className="gold-text">{t.heritage.goldTitle}</span>
                        </h2>
                        <span className="gold-divider" />
                        <p className={styles.heritageText}>
                            {t.heritage.subtitle}
                        </p>
                        <a href="/story" className="btn-luxury">
                            <span>{lang === 'en' ? 'Discover Our Heritage' : 'اكتشف تراثنا'}</span>
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
