'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './page.module.css';

const ProductHero = dynamic(() => import('@/components/ui/ProductHero'), { ssr: false });

const PRODUCTS = [
    { id: 1, name: 'Oud Al Dalal', price: '$89', category: 'Signature', notes: 'Sandalwood · Amber · Musk', desc: 'Our flagship creation — a deep, resinous oud wrapped in warm amber.' },
    { id: 2, name: 'Zuhoor', price: '$65', category: 'Floral', notes: 'Rose · Jasmine · Oud', desc: 'A delicate floral bouquet lifted by a base of aged African oud.' },
    { id: 3, name: 'Aseel', price: '$120', category: 'Heritage', notes: 'African Oud · Neroli · Vetiver', desc: 'Pure African oud in its most authentic expression.' },
    { id: 4, name: 'Amber Nights', price: '$75', category: 'Warm', notes: 'Amber · Vanilla · Incense', desc: 'A sumptuous amber accord ideal for evenings and celebrations.' },
    { id: 5, name: 'Sultani', price: '$110', category: 'Signature', notes: 'Royal Oud · Saffron · Patchouli', desc: 'A regal blend fit for royalty — rich, complex, unforgettable.' },
    { id: 6, name: 'Tahara', price: '$55', category: 'Fresh', notes: 'White Musk · Sandalwood · Cedar', desc: 'A clean, purifying scent for everyday serenity.' },
];

export default function GalleryPage() {
    const [active, setActive] = useState(null);

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
                        <p className={styles.overline}>Full Collection</p>
                        <h1 className={styles.title}>
                            The <span className="gold-text">Bakhour</span> Gallery
                        </h1>
                        <span className="gold-divider" />
                    </div>
                </div>

                {/* Product Grid */}
                <section className={`${styles.grid} section-padding`}>
                    <div className="container">
                        <div className={styles.products}>
                            {PRODUCTS.map((p, i) => (
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
                                        <button className="btn-luxury" onClick={(e) => { e.stopPropagation(); }}>
                                            <span>Add to Cart</span>
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
