'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { lang, toggleLanguage } = useLanguage();
    const t = translations[lang].nav;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { href: '/', label: t.home },
        { href: '/gallery', label: t.collection },
        { href: '/story', label: t.story },
        { href: '/packaging', label: t.packaging },
    ];

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                <Link href="/">
                    <span className="gold-text">Al Dalal</span>
                    <span className={styles.logoSub}>Bakhour</span>
                </Link>
            </div>

            <div className={styles.navRight}>
                <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                    {links.map((l) => (
                        <li key={l.href}>
                            <Link href={l.href} onClick={() => setMenuOpen(false)}>
                                {l.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/gallery" className={styles.ctaNav} onClick={() => setMenuOpen(false)}>
                            {t.shopNow}
                        </Link>
                    </li>
                </ul>

                <div className={styles.controls}>
                    <button className={styles.langToggle} onClick={toggleLanguage}>
                        {lang === 'en' ? 'AR' : 'EN'}
                    </button>

                    <Link href="/cart" id="cart-icon" className={styles.cartIcon} aria-label="View shopping cart">
                        <ShoppingBag size={22} strokeWidth={1.5} />
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </Link>
                </div>

                <button
                    className={styles.burger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={menuOpen ? styles.burgerX : ''} />
                    <span className={menuOpen ? styles.burgerX2 : ''} />
                    <span className={menuOpen ? styles.burgerX3 : ''} />
                </button>
            </div>
        </nav>
    );
}
