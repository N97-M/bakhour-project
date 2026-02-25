'use client';
import Link from 'next/link';
import { Plane } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './Footer.module.css';

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

export default function Footer() {
    const { lang } = useLanguage();
    const t = translations[lang].footer;
    const navT = translations[lang].nav;

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <p className="gold-text" style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', letterSpacing: '4px' }}>
                        Al Dalal
                    </p>
                    <p style={{ fontSize: '0.55rem', letterSpacing: '6px', color: '#C8BFB2', textTransform: 'uppercase', marginTop: 2 }}>
                        Bakhour
                    </p>
                    <p className={styles.tagline}>{t.tagline}</p>

                    {/* Social Media */}
                    <div className={styles.socials}>
                        <a
                            href="https://instagram.com/ALDALALBAKHOUR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href="https://facebook.com/ALDALALBAKHOUR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Facebook"
                        >
                            <FacebookIcon />
                        </a>
                    </div>
                </div>

                <div className={styles.col}>
                    <h4>{t.explore}</h4>
                    <Link href="/gallery">{navT.collection}</Link>
                    <Link href="/story">{navT.story}</Link>
                    <Link href="/testimonials">{navT.testimonials}</Link>
                </div>

                <div className={styles.col}>
                    <h4>{t.support}</h4>
                    <a href="https://wa.me/971562797952" target="_blank" rel="noopener noreferrer">
                        +971 56 279 7952
                    </a>
                    <a href="https://wa.me/971547413182" target="_blank" rel="noopener noreferrer">
                        +971 54 741 3182
                    </a>
                    <a href="mailto:aldalalbakhour@gmail.com" className={styles.emailLink}>
                        aldalalbakhour@gmail.com
                    </a>
                </div>

                <div className={styles.col}>
                    <h4>{lang === 'ar' ? 'معلومات' : 'Support'}</h4>
                    <Link href="#">{t.shipping}</Link>
                    <Link href="#">{t.care}</Link>

                    {/* Delivery Info */}
                    <div className={styles.deliveryInfo}>
                        <Plane size={14} className={styles.planeIcon} />
                        <span>{t.delivery}</span>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <span className="gold-divider" />
                <p>{t.rights}</p>
            </div>
        </footer>
    );
}
