'use client';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './page.module.css';
import { flyToCart } from '@/utils/flyToCart';



function FeaturedCard({ product, index }) {
    const ref = useRef(null);
    const { addToCart } = useCart();
    const { lang } = useLanguage();

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
            style={{ transitionDelay: `${index * 0.15}s` }}
        >
            <div className={styles.cardTop}>
                <div className={styles.cardNumber}>0{product.id}</div>
                <div className={styles.cardNotes}>
                    {product.notes.split(' · ').map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>
            </div>
            <h3 className={`${styles.cardName} gold-text`}>{product.name}</h3>
            <p className={styles.cardDesc}>{product.desc}</p>
            <div className={styles.cardFooter}>
                <span className={styles.price}>{product.price}</span>
                <button
                    className={`${styles.addBtn} btn-luxury`}
                    onClick={(e) => { addToCart(product); flyToCart(e); }}
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
    const t = translations[lang];
    const featured = t.products.slice(0, 3);

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
                            {featured.map((p, i) => (
                                <FeaturedCard key={p.id} product={p} index={i} />
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
