'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './page.module.css';
import { flyToCart } from '@/utils/flyToCart';

const ProductHero = dynamic(() => import('@/components/ui/ProductHero'), { ssr: false });



export default function GalleryPage() {
    const [active, setActive] = useState(null);
    const { addToCart } = useCart();
    const { lang } = useLanguage();
    const t = translations[lang];
    const products = t.products;

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
                        <div className={styles.products}>
                            {products.map((p, i) => (
                                <div
                                    key={p.id}
                                    className={`${styles.card} ${active === p.id ? styles.active : ''}`}
                                    onClick={() => setActive(active === p.id ? null : p.id)}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className={styles.cardGlow} />
                                    <div className={styles.cardCategory}>{p.category}</div>
                                    <h2 className={`${styles.cardName} gold-text`}>{p.name}</h2>
                                    <p className={styles.cardNotes}>{p.notes}</p>
                                    <p className={styles.cardDesc}>{p.desc}</p>
                                    <div className={styles.cardBottom}>
                                        <span className={styles.price}>{p.price}</span>
                                        <button
                                            className="btn-luxury"
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
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
