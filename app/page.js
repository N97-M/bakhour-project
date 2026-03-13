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

function CategoryCard({ category, index, lang }) {
    const ref = useRef(null);
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
            onClick={() => router.push(`/gallery?category=${category.id}`)}
        >
            <div className={styles.cardImageWrapper}>
                <Image
                    src={category.image}
                    alt={category.name}
                    width={400}
                    height={400}
                    className={styles.cardImage}
                />
                <div className={styles.shopBtn}>
                    {lang === 'en' ? 'Shop Collection' : 'تسوق المجموعة'}
                </div>
            </div>
            <div className={styles.cardInfo}>
                <h3 className={styles.cardName}>{category.name}</h3>
            </div>
        </div>
    );
}

export default function Home() {
    const sectionRef = useRef(null);
    const { lang } = useLanguage();
    const t = translations[lang];
    const [categories, setCategories] = useState([
        { id: 'bakhour', name: lang === 'en' ? 'Bakhour' : 'البخور', image: '/product-hero.png' },
        { id: 'khamriyat', name: lang === 'en' ? 'Khomrah' : 'الخمر', image: '/product-hero.png' },
        { id: 'mahlab', name: lang === 'en' ? 'Mahlab' : 'محلب', image: '/product-hero.png' },
        { id: 'gifts', name: lang === 'en' ? 'Packages & Gifts' : 'البكجات والهدايا', image: '/product-hero.png' },
        { id: 'bestSellers', name: lang === 'en' ? 'Best Sellers' : 'الأكثر مبيعاً', image: '/product-hero.png' }
    ]);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'home_collections');
            if (data && data.length > 0 && data[0].value) {
                const configValue = data[0].value;
                const mapped = configValue.map(c => ({
                    id: c.id,
                    name: lang === 'en' ? c.name_en : c.name_ar,
                    image: c.image
                }));
                setCategories(mapped);
            }
        };
        fetchCategories();
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

                            <div className={styles.grid}>
                                {categories.map((c, i) => (
                                    <CategoryCard key={c.id} category={c} index={i} lang={lang} />
                                ))}
                            </div>

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
