'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import styles from './page.module.css';

export default function StoryPage() {
    const { lang } = useLanguage();
    const t = translations[lang].story;

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <p className={styles.overline}>{lang === 'en' ? 'Heritage · Luxury' : 'تراث · فخامة'}</p>
                        <h1 className={styles.title}>
                            {t.heroTitle} <span className="gold-text">{t.heroGoldTitle}</span>
                        </h1>
                        <span className="gold-divider" />
                        <p className={styles.subtitle}>
                            {t.heroSubtitle}
                        </p>
                    </div>
                </section>

                {/* Philosophy */}
                <section className={`${styles.philosophy} section-padding`}>
                    <div className="container">
                        <div className={styles.philosophyGrid}>
                            <div className={styles.philosophyText}>
                                <p className={styles.overline}>{lang === 'en' ? 'Our Philosophy' : 'فلسفتنا'}</p>
                                <h2 className={styles.sectionTitle}>
                                    {t.philosophyTitle} <span className="gold-text">{t.philosophyGold}</span>
                                </h2>
                                <span className="gold-divider" style={{ margin: '1.5rem 0' }} />
                                <p>{t.philosophyText1}</p>
                                <p style={{ marginTop: '1.2rem' }}>{t.philosophyText2}</p>
                            </div>
                            <div className={styles.philosophyValues}>
                                {t.values.map((v) => (
                                    <div key={v} className={styles.valueTag}>
                                        <div className={styles.valueDot} />
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline - Styled more as Story Milestones */}
                <section className={`${styles.timeline} section-padding`}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <p className={styles.overline}>{lang === 'en' ? 'Our Journey' : 'رحلتنا'}</p>
                            <h2 className={styles.sectionTitle}>
                                {t.journeyTitle} <span className="gold-text">{t.journeyGold}</span>
                            </h2>
                        </div>
                        <div className={styles.timelineItems}>
                            {t.timeline.map((item, i) => (
                                <div key={i} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.left : styles.right}`}>
                                    <div className={styles.timelineYear}>0{i + 1}</div>
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

