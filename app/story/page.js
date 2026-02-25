'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import styles from './page.module.css';

const TIMELINE = [
    { year: '1987', title: 'The Beginning', text: 'Founded in the heart of Khartoum, Al Dalal started as a small family atelier crafting bakhoor for weddings and celebrations.' },
    { year: '1995', title: 'The Craft Refined', text: 'A decade of experimentation culminated in our signature oud sourcing from East African forests — a process we still honor today.' },
    { year: '2006', title: 'Heritage Preserved', text: 'We partnered with master wood carvers to create our iconic dark vessels — functional art that has become our visual identity.' },
    { year: '2015', title: 'Global Recognition', text: 'Al Dalal bakhour crossed borders, reaching fragrance connoisseurs across the Gulf, Europe, and beyond.' },
    { year: '2024', title: 'Digital Luxury', text: 'Bringing our boutique experience to the world — a seamless digital encounter that honors our timeless heritage.' },
];

export default function StoryPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <p className={styles.overline}>Est. 1987</p>
                        <h1 className={styles.title}>
                            The Journey of <span className="gold-text">Fragrance</span>
                        </h1>
                        <span className="gold-divider" />
                        <p className={styles.subtitle}>
                            A legacy written in smoke, wood, and memory.
                        </p>
                    </div>
                </section>

                {/* Philosophy */}
                <section className={`${styles.philosophy} section-padding`}>
                    <div className="container">
                        <div className={styles.philosophyGrid}>
                            <div className={styles.philosophyText}>
                                <p className={styles.overline}>Our Philosophy</p>
                                <h2 className={styles.sectionTitle}>
                                    Scent is <span className="gold-text">Memory</span>
                                </h2>
                                <span className="gold-divider" style={{ margin: '1.5rem 0' }} />
                                <p>Every fragrance we create carries a story — of the land where the wood was harvested, the hands that blended it, and the moment it was shared. We believe bakhour is not merely an aroma; it is an invitation to feel.</p>
                                <p style={{ marginTop: '1.2rem' }}>At Al Dalal, we refuse to compromise. Each ingredient is selected for its authenticity, purity, and contribution to a nuanced, layered experience that unfolds slowly, just as it should.</p>
                            </div>
                            <div className={styles.philosophyValues}>
                                {['Authenticity', 'Craftsmanship', 'Heritage', 'Purity'].map((v) => (
                                    <div key={v} className={styles.valueTag}>
                                        <div className={styles.valueDot} />
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className={`${styles.timeline} section-padding`}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <p className={styles.overline}>Our Journey</p>
                            <h2 className={styles.sectionTitle}>
                                Four Decades of <span className="gold-text">Excellence</span>
                            </h2>
                        </div>
                        <div className={styles.timelineItems}>
                            {TIMELINE.map((item, i) => (
                                <div key={item.year} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}>
                                    <div className={styles.timelineYear}>{item.year}</div>
                                    <div className={styles.timelineDot} />
                                    <div className={styles.timelineCard}>
                                        <h3>{item.title}</h3>
                                        <p>{item.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div className={styles.timelineLine} />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
