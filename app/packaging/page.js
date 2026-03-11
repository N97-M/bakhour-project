'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import styles from './page.module.css';

export default function PackagingPage() {
    const { lang } = useLanguage();
    const t = translations[lang].packaging;
    const [selectedImg, setSelectedImg] = useState(null);

    const images = [
        "/Our Packaging for بخور الدلال/1.jpeg",
        "/Our Packaging for بخور الدلال/2.jpeg",
        "/Our Packaging for بخور الدلال/3.jpeg",
        "/Our Packaging for بخور الدلال/4.jpeg",
        "/Our Packaging for بخور الدلال/5.jpeg",
        "/Our Packaging for بخور الدلال/6.jpeg",
        "/Our Packaging for بخور الدلال/7.PNG",
        "/Our Packaging for بخور الدلال/8.jpeg",
        "/Our Packaging for بخور الدلال/9.PNG",
        "/Our Packaging for بخور الدلال/10.jpeg",
        "/Our Packaging for بخور الدلال/11.jpg",
        "/Our Packaging for بخور الدلال/12.jpg",
        "/Our Packaging for بخور الدلال/13.jpg",
        "/Our Packaging for بخور الدلال/14.jpg"
    ];

    return (
        <div className={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <p className={styles.heroOverline}>{lang === 'en' ? 'Exquisite Presentation' : 'تقديم استثنائي'}</p>
                        <h1 className={styles.heroTitle}>
                            {t.title} <span className="gold-text">{t.goldTitle}</span>
                        </h1>
                        <p className={styles.heroSubtitle}>{t.subtitle}</p>
                    </div>
                </section>

                {/* Narrative Section */}
                <section className={styles.narrative}>
                    <div className="container">
                        <div className={styles.inner}>
                            <h2 className={styles.sectionTitle}>
                                {lang === 'en' ? 'Crafted for' : 'صُمم لـ'} <span className="gold-text">{lang === 'en' ? 'Royalty' : 'الملوك'}</span>
                            </h2>
                            <p className={styles.description}>{t.description}</p>

                            <div className={styles.features}>
                                {t.features.map((f, i) => (
                                    <div key={i} className={styles.feature}>
                                        <div className={styles.featureIcon}>
                                            <span className="gold-text">{i + 1}</span>
                                        </div>
                                        <h3>{f.title}</h3>
                                        <p>{f.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Gallery */}
                <section className={styles.gallerySection}>
                    <div className="container">
                        <div className={styles.masonryGrid}>
                            {images.map((src, i) => (
                                <div
                                    key={i}
                                    className={styles.galleryItem}
                                    onClick={() => setSelectedImg(src)}
                                    role="button"
                                    aria-label="Enlarge image"
                                >
                                    <Image
                                        src={src}
                                        alt={`Al Dalal Packaging ${i + 1}`}
                                        width={1200}
                                        height={1600}
                                        className={styles.image}
                                        priority={i < 4}
                                        quality={100}
                                        unoptimized={true}
                                    />
                                    <div className={styles.imageOverlay}>
                                        <div className={styles.overlayContent}>
                                            <span className="gold-text">{lang === 'en' ? 'View HD' : 'عرض بدقة عالية'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Lightbox Modal */}
                {selectedImg && (
                    <div className={styles.lightbox} onClick={() => setSelectedImg(null)}>
                        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.closeBtn} onClick={() => setSelectedImg(null)}>&times;</button>
                            <Image
                                src={selectedImg}
                                alt="Enlarged Packaging"
                                width={1200}
                                height={1600}
                                className={styles.fullImage}
                                unoptimized={true}
                            />
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <section className={styles.cta}>
                    <div className="container">
                        <div className={styles.ctaBox}>
                            <h2>{lang === 'en' ? 'Gift the Essence of Sudanese Luxury' : 'أهدِ جوهر الفخامة السودانية'}</h2>
                            <p>{lang === 'en' ? 'Experience the complete journey of Al Dalal.' : 'عِش التجربة الكاملة مع بخور الدلال.'}</p>
                            <a href="/gallery" className="btn-luxury">
                                <span>{lang === 'en' ? 'Explore Collection' : 'اكتشف التشكيلة'}</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
