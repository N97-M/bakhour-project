'use client';
import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/ui/Hero';
import Footer from '@/components/ui/Footer';
import { useEffect, useRef } from 'react';
import styles from './page.module.css';

// Product data for the featured section
const FEATURED = [
    {
        id: 1,
        name: 'Oud Al Dalal',
        desc: 'The signature blend — deep, woody, divine.',
        price: '$89',
        notes: ['Sandalwood', 'Amber', 'Musk'],
    },
    {
        id: 2,
        name: 'Zuhoor',
        desc: 'A floral symphony of rose and jasmine.',
        price: '$65',
        notes: ['Rose', 'Jasmine', 'Oud'],
    },
    {
        id: 3,
        name: 'Aseel',
        desc: 'The authenticity of genuine African Oud.',
        price: '$120',
        notes: ['African Oud', 'Neroli', 'Vetiver'],
    },
];

function FeaturedCard({ product, index }) {
    const ref = useRef(null);

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
                    {product.notes.map((n) => (
                        <span key={n}>{n}</span>
                    ))}
                </div>
            </div>
            <h3 className={`${styles.cardName} gold-text`}>{product.name}</h3>
            <p className={styles.cardDesc}>{product.desc}</p>
            <div className={styles.cardFooter}>
                <span className={styles.price}>{product.price}</span>
                <button className={`${styles.addBtn} btn-luxury`}>
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}

export default function Home() {
    const sectionRef = useRef(null);

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
                            <p className={styles.overline}>Curated for You</p>
                            <h2 className={styles.sectionTitle}>
                                The <span className="gold-text">Collection</span>
                            </h2>
                            <span className="gold-divider" />
                        </div>
                        <div className={styles.grid}>
                            {FEATURED.map((p, i) => (
                                <FeaturedCard key={p.id} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Heritage Banner ── */}
                <section className={styles.heritageBanner}>
                    <div className={styles.heritageOverlay} />
                    <div className={styles.heritageContent}>
                        <p className={styles.overline}>Est. 1987 · Khartoum, Sudan</p>
                        <h2 className={styles.heritageTitle}>
                            Three decades of <span className="gold-text">olfactory mastery</span>
                        </h2>
                        <span className="gold-divider" />
                        <p className={styles.heritageText}>
                            Every piece of bakhoor is hand-crafted in small batches,<br />
                            using ingredients sourced from across seven countries.
                        </p>
                        <a href="/story" className="btn-luxury">
                            <span>Discover Our Heritage</span>
                        </a>
                    </div>
                </section>

                {/* ── AI Scent Quiz Teaser ── */}
                <section className={`${styles.quizSection} section-padding`}>
                    <div className="container">
                        <div className={styles.quizInner}>
                            <div className={styles.quizText}>
                                <p className={styles.overline}>Personalised</p>
                                <h2>Find Your <span className="gold-text">Perfect Scent</span></h2>
                                <span className="gold-divider" style={{ margin: '1.5rem 0' }} />
                                <p className={styles.quizDesc}>
                                    Our AI Scent Advisor matches your preferences to the ideal bakhoor — traditional versus modern, soft versus bold.
                                </p>
                                <a href="#quiz" className="btn-luxury" style={{ marginTop: '2rem' }}>
                                    <span>Take the Quiz</span>
                                </a>
                            </div>
                            <div className={styles.quizCard}>
                                <div className={styles.quizStep}>
                                    <span>01</span>
                                    <p>Tell us your scent preference</p>
                                </div>
                                <div className={styles.quizStep}>
                                    <span>02</span>
                                    <p>Set the occasion &amp; intensity</p>
                                </div>
                                <div className={styles.quizStep}>
                                    <span>03</span>
                                    <p>Receive your curated match</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
