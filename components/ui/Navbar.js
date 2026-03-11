'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { lang, toggleLanguage } = useLanguage();
    const t = translations[lang].nav;

    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);

        // Check current session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            window.removeEventListener('scroll', onScroll);
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const links = [
        { href: '/', label: t.home },
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
                    <li>
                        <Link href="/" onClick={() => setMenuOpen(false)}>
                            {t.home}
                        </Link>
                    </li>
                    <li className={styles.dropdownContainer}>
                        <Link href="/gallery" onClick={() => setMenuOpen(false)}>
                            {t.collection}
                        </Link>
                        <ul className={styles.dropdownMenu}>
                            <li><Link href="/gallery?category=bakhour" onClick={() => setMenuOpen(false)}>{t.bakhour}</Link></li>
                            <li><Link href="/gallery?category=khamriyat" onClick={() => setMenuOpen(false)}>{t.khamriyat}</Link></li>
                            <li><Link href="/gallery?category=mahlab" onClick={() => setMenuOpen(false)}>{t.mahlab}</Link></li>
                            <li><Link href="/gallery?category=gifts" onClick={() => setMenuOpen(false)}>{t.gifts}</Link></li>
                            <li><Link href="/gallery?category=bestSellers" onClick={() => setMenuOpen(false)}>{t.bestSellers}</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link href="/story" onClick={() => setMenuOpen(false)}>
                            {t.story}
                        </Link>
                    </li>
                    <li>
                        <Link href="/packaging" onClick={() => setMenuOpen(false)}>
                            {t.packaging}
                        </Link>
                    </li>
                    <li>
                        <Link href="/gallery" className={styles.ctaNav} onClick={() => setMenuOpen(false)}>
                            {t.shopNow}
                        </Link>
                    </li>
                </ul>

                <div className={styles.controls}>
                    {user ? (
                        <div className={styles.userSection}>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>
                                    <User size={16} /> {user.user_metadata?.full_name?.split(' ')[0] || 'Member'}
                                </span>
                                {['aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'].includes(user.email) && (
                                    <Link href="/admin/dashboard" className={styles.adminLink} title="Admin Dashboard">
                                        Admin
                                    </Link>
                                )}
                            </div>
                            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className={styles.loginLink}>
                            {lang === 'en' ? 'Login' : 'دخول'}
                        </Link>
                    )}

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
