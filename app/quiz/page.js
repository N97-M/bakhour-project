'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { ArrowRight, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react';
import styles from './page.module.css';

export default function QuizPage() {
    const { lang } = useLanguage();
    const t = translations[lang].quiz;
    const allProducts = translations[lang].products;

    const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Result
    const [answers, setAnswers] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
        if (step < t.questions.length) {
            setStep(step + 1);
        }
    };

    useEffect(() => {
        if (step === t.questions.length + 1) {
            calculateResult();
        }
    }, [step]);

    const calculateResult = () => {
        setIsCalculating(true);

        // Match logic
        let matchId = 1;
        const { 1: vibe, 2: family, 3: intensity } = answers;

        if (family === 'oud') {
            matchId = intensity === 'high' ? 1 : 2; // Rooh Al Oud or Al Dalal Mix
        } else if (family === 'sandal') {
            matchId = 3; // Sandalwood Balls
        } else if (family === 'floral') {
            if (intensity === 'high') matchId = 5; // Anfar
            else if (intensity === 'mid') matchId = 6; // Shaf
            else matchId = 7; // Musk Khumra
        } else if (vibe === 'bold') {
            matchId = 1; // Rooh Al Oud
        }

        const product = allProducts.find(p => p.id === matchId) || allProducts[0];

        setTimeout(() => {
            setRecommendation(product);
            setIsCalculating(false);
        }, 2000);
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setRecommendation(null);
    };

    return (
        <div className={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <main className={styles.quizWrapper}>
                <div className={styles.container}>
                    {/* Progress Bar */}
                    {step > 0 && step <= t.questions.length && (
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${(step / t.questions.length) * 100}%` }}
                            />
                        </div>
                    )}

                    {/* Step Content */}
                    <div className={styles.contentCard}>
                        {step === 0 ? (
                            <div className={styles.hero}>
                                <p className={styles.overline}>{lang === 'en' ? 'Exclusive Experience' : 'تجربة حصرية'}</p>
                                <h1 className={styles.megaTitle}>{t.title}</h1>
                                <p className={styles.subtitle}>{t.subtitle}</p>
                                <button className="btn-luxury" onClick={() => setStep(1)} style={{ marginTop: '2rem' }}>
                                    <span>{t.start}</span>
                                </button>
                            </div>
                        ) : step <= t.questions.length ? (
                            <div className={styles.questionSection}>
                                <div className={styles.stepCounter}>0{step} / 0{t.questions.length}</div>
                                <h2 className={styles.questionText}>{t.questions[step - 1].text}</h2>
                                <div className={styles.optionsGrid}>
                                    {t.questions[step - 1].options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className={styles.optionBtn}
                                            onClick={() => handleAnswer(step, opt.value)}
                                        >
                                            <span className={styles.optionLabel}>{opt.label}</span>
                                            <ArrowRight size={18} className={styles.arrowIcon} />
                                        </button>
                                    ))}
                                </div>
                                <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
                                    <ArrowLeft size={16} /> {lang === 'en' ? 'Back' : 'رجوع'}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.resultSection}>
                                {isCalculating ? (
                                    <div className={styles.loaderBox}>
                                        <div className={styles.spinner} />
                                        <p>{lang === 'en' ? 'Analyzing your scent profile...' : 'جاري تحليل بصمتك العطرية...'}</p>
                                    </div>
                                ) : recommendation && (
                                    <div className={styles.recommendationCard}>
                                        <div className={styles.resultHeader}>
                                            <p className={styles.overline}>{t.resultTitle}</p>
                                            <h2 className={styles.megaTitle}>{recommendation.name}</h2>
                                            <p className={styles.resultSub}>{t.resultSubtitle}</p>
                                        </div>

                                        <div className={styles.productReveal}>
                                            <div className={styles.revealInfo}>
                                                <div className={styles.categoryBadge}>{recommendation.category}</div>
                                                <p className={styles.desc}>{recommendation.desc}</p>
                                                <div className={styles.notes}>
                                                    {recommendation.notes.split(' · ').map(n => (
                                                        <span key={n}>{n}</span>
                                                    ))}
                                                </div>
                                                <div className={styles.price}>{recommendation.price}</div>

                                                <div className={styles.resultActions}>
                                                    <button className="btn-luxury">
                                                        <span>{lang === 'en' ? 'Add to Collection' : 'أضف لمجموعتك'}</span>
                                                    </button>
                                                    <button className={styles.resetBtn} onClick={resetQuiz}>
                                                        <RefreshCw size={16} /> {t.back}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
