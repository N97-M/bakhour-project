'use client';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
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
                    <p className={styles.tagline}>Where heritage becomes fragrance.</p>
                </div>

                <div className={styles.links}>
                    <div className={styles.col}>
                        <h4>Explore</h4>
                        <Link href="/gallery">Collection</Link>
                        <Link href="/story">Our Story</Link>
                        <Link href="/testimonials">Reviews</Link>
                    </div>
                    <div className={styles.col}>
                        <h4>Support</h4>
                        <Link href="#">Shipping &amp; Returns</Link>
                        <Link href="#">Care Guide</Link>
                        <Link href="#">Contact</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <span className="gold-divider" />
                <p>© 2026 Al Dalal Bakhour. All rights reserved.</p>
            </div>
        </footer>
    );
}
