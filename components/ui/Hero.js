'use client';
import ProductHero from '@/components/ui/ProductHero';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
    const textRef = useRef(null);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setTimeout(() => el.classList.add(styles.revealed), 400);
    }, []);

    return (
        <section className={styles.hero}>
            {/* ── Left: Text Content ── */}
            <div className={styles.textSide} ref={textRef}>
                <p className={styles.overline}>Sudan · Heritage · Luxury</p>
                <h1 className={styles.title}>
                    <span className="gold-text">Al Dalal</span>
                    <br />
                    Bakhour
                </h1>
                <span className="gold-divider" />
                <p className={styles.subtitle}>
                    An intimate encounter with centuries-old<br />
                    Sudanese tradition, elevated to its purest form.
                </p>
                <div className={styles.ctas}>
                    <Link href="/gallery" className="btn-luxury">
                        <span>Explore the Collection</span>
                    </Link>
                    <Link href="/story" className={styles.secondaryCta}>
                        Our Story →
                    </Link>
                </div>
            </div>

            {/* ── Right: Product Image ── */}
            <div className={styles.sceneSide}>
                <ProductHero />
            </div>

            {/* Bottom fade */}
            <div className={styles.overlayBottom} />

            {/* Scroll indicator */}
            <div className={styles.scrollIndicator}>
                <div className={styles.scrollLine} />
                <span>Scroll</span>
            </div>
        </section>
    );
}
