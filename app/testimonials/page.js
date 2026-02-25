'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import styles from './page.module.css';

const REVIEWS = [
    { name: 'Fatima Al-Hassan', location: 'Dubai, UAE', rating: 5, text: 'I have tried many bakhour brands over the years, but Al Dalal is in a completely different league. The smoke lingers for hours and transforms any space into something extraordinary.' },
    { name: 'Ahmed Mirghani', location: 'Khartoum, Sudan', rating: 5, text: 'Growing up, the scent of my grandmother\'s bakhour was the scent of home. Al Dalal captures that feeling perfectly — it is heritage in a jar.' },
    { name: 'Layla Farouk', location: 'London, UK', rating: 5, text: 'Discovered Al Dalal at a friend\'s home in Riyadh. Immediately ordered online. The packaging itself is museum-worthy, and the scent — Oud Al Dalal — is simply transcendent.' },
    { name: 'Omar Al-Rashid', location: 'Riyadh, KSA', rating: 5, text: 'Used for our wedding. Our guests were asking about the fragrance all evening. Three months later people still mention it. Worth every penny.' },
    { name: 'Sara Yousif', location: 'Toronto, Canada', rating: 5, text: 'As a Sudanese living abroad, Al Dalal is how I bring a piece of home into my apartment. The Aseel blend especially — it feels like walking through a Khartoum souk at golden hour.' },
    { name: 'Khalid Mansour', location: 'Doha, Qatar', rating: 5, text: 'I gifted the Sultani blend to my father and he called me twice to say how much he loves it. That\'s the best review I can give — it made a grown man emotional.' },
];

function StarRating({ count }) {
    return (
        <div className={styles.stars}>
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className={styles.star}>★</span>
            ))}
        </div>
    );
}

export default function TestimonialsPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Header */}
                <section className={styles.header}>
                    <p className={styles.overline}>From Our Customers</p>
                    <h1 className={styles.title}>
                        Voices of <span className="gold-text">Devotion</span>
                    </h1>
                    <span className="gold-divider" />
                    <p className={styles.subtitle}>Trusted by fragrance lovers across 20+ countries.</p>
                </section>

                {/* Stats */}
                <section className={styles.stats}>
                    <div className="container">
                        <div className={styles.statsGrid}>
                            {[
                                { num: '10,000+', label: 'Happy Customers' },
                                { num: '20+', label: 'Countries' },
                                { num: '4.98', label: 'Average Rating' },
                                { num: '35+', label: 'Years of Heritage' },
                            ].map((s) => (
                                <div key={s.label} className={styles.stat}>
                                    <div className={`${styles.statNum} gold-text`}>{s.num}</div>
                                    <div className={styles.statLabel}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reviews Grid */}
                <section className={`${styles.reviews} section-padding`}>
                    <div className="container">
                        <div className={styles.reviewsGrid}>
                            {REVIEWS.map((r, i) => (
                                <div
                                    key={r.name}
                                    className={styles.card}
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    <div className={styles.cardInner}>
                                        <StarRating count={r.rating} />
                                        <p className={styles.reviewText}>"{r.text}"</p>
                                        <div className={styles.reviewer}>
                                            <div className={styles.reviewerAvatar}>{r.name[0]}</div>
                                            <div>
                                                <div className={styles.reviewerName}>{r.name}</div>
                                                <div className={styles.reviewerLoc}>{r.location}</div>
                                            </div>
                                        </div>
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
