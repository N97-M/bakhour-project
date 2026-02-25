'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/gallery', label: 'Collection' },
        { href: '/story', label: 'Our Story' },
        { href: '/testimonials', label: 'Testimonials' },
    ];

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                <Link href="/">
                    <span className="gold-text">Al Dalal</span>
                    <span className={styles.logoSub}>Bakhour</span>
                </Link>
            </div>

            <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
                {links.map((l) => (
                    <li key={l.href}>
                        <Link href={l.href} onClick={() => setMenuOpen(false)}>
                            {l.label}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link href="/gallery" className={styles.ctaNav}>
                        Shop Now
                    </Link>
                </li>
            </ul>

            <button
                className={styles.burger}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={menuOpen ? styles.burgerX : ''} />
                <span className={menuOpen ? styles.burgerX2 : ''} />
                <span className={menuOpen ? styles.burgerX3 : ''} />
            </button>
        </nav>
    );
}
