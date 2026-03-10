'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/utils/supabase';
import styles from './OnboardingPopup.module.css';

export default function OnboardingPopup() {
    const { lang } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            // Check if dismissed before
            const dismissed = localStorage.getItem('al-dalal-onboarding-dismissed');
            if (dismissed) return;

            // Check if user is already logged in
            const { data: { session } } = await supabase.auth.getSession();
            if (session) return;

            // Add a small delay for better user experience
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        };

        checkStatus();
    }, []);

    const handleSkip = () => {
        setIsVisible(false);
        localStorage.setItem('al-dalal-onboarding-dismissed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.content}>
                    <p className={styles.overline}>{lang === 'en' ? 'Welcome to Al Dalal' : 'مرحباً بكم في بخور الدلال'}</p>
                    <h2 className={styles.title}>
                        {lang === 'en'
                            ? 'Experience True Luxury'
                            : 'عِش تجربة الفخامة الحقيقية'}
                    </h2>
                    <p className={styles.description}>
                        {lang === 'en'
                            ? 'Create an account to get updates about new products and special offers.'
                            : 'أنشئ حساباً للحصول على تحديثات حول المنتجات الجديدة والعروض الخاصة.'}
                    </p>

                    <div className={styles.actions}>
                        <Link href="/signup" className="btn-luxury" onClick={handleSkip}>
                            <span>{lang === 'en' ? 'Sign Up' : 'إنشاء حساب'}</span>
                        </Link>

                        <Link href="/login" className={styles.loginBtn} onClick={handleSkip}>
                            {lang === 'en' ? 'Login' : 'تسجيل الدخول'}
                        </Link>

                        <button className={styles.skipBtn} onClick={handleSkip}>
                            {lang === 'en' ? 'Skip for Now' : 'تخطي الآن'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
