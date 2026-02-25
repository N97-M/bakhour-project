import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductHero from '@/components/ui/ProductHero';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './Hero.module.css';

export default function Hero() {
    const textRef = useRef(null);
    const { lang } = useLanguage();
    const t = translations[lang].hero;

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setTimeout(() => el.classList.add(styles.revealed), 400);
    }, []);

    return (
        <section className={styles.hero}>
            {/* ── Left: Text Content ── */}
            <div className={styles.textSide} ref={textRef}>
                <p className={styles.overline}>{lang === 'en' ? 'Sudan · Heritage · Luxury' : 'السودان · تراث · فخامة'}</p>
                <h1 className={styles.title}>
                    <span className="gold-text">{lang === 'en' ? 'Al Dalal' : 'بخور'}</span>
                    <br />
                    {lang === 'en' ? 'Bakhour' : 'الدلال'}
                </h1>
                <span className="gold-divider" />
                <p className={styles.subtitle}>
                    {t.subtitle}
                </p>
                <div className={styles.ctas}>
                    <Link href="/gallery" className="btn-luxury">
                        <span>{t.cta}</span>
                    </Link>
                    <Link href="/story" className={styles.secondaryCta}>
                        {lang === 'en' ? 'Our Story →' : '← قصتنا'}
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
