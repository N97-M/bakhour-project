'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

function VerifyContent() {
    const searchParams = useSearchParams();
    const { lang } = useLanguage();
    const tEn = translations.en.auth.verify;
    const tAr = translations.ar.auth.verify;
    
    const [status, setStatus] = useState('success'); // success, error, already
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const checkVerification = async () => {
            const error = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');
            
            // Check if user is already logged in (might have already clicked the link)
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setStatus('already');
                return;
            }

            if (error) {
                console.error('Verification error:', { error, errorDescription });
                // Check for common 'already verified' error strings from Supabase
                const desc = errorDescription?.toLowerCase() || '';
                if (desc.includes('already verified') || 
                    desc.includes('identity_already_verified') ||
                    desc.includes('already_confirmed')) {
                    setStatus('already');
                } else {
                    setStatus('error');
                    setErrorMsg(errorDescription || error);
                }
            } else {
                // If no error, assume success (Supabase redirects here on success)
                setStatus('success');
            }
        };
        
        checkVerification();
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    {status === 'success' || status === 'already' ? (
                        <CheckCircle size={80} strokeWidth={1} />
                    ) : (
                        <AlertCircle size={80} strokeWidth={1} color="#ff4444" />
                    )}
                </div>

                <div className={styles.textGroup}>
                    <h1 className={styles.title}>
                        {status === 'success' ? tAr.successTitle : (status === 'already' ? tAr.alreadyTitle : tAr.errorTitle)}
                    </h1>
                    <p className={styles.message}>
                        {status === 'success' ? tAr.successText : (status === 'already' ? tAr.alreadyText : tAr.errorText)}
                    </p>
                </div>

                <div className={styles.divider} />

                <div className={styles.textGroup}>
                    <h2 className={styles.titleEn}>
                        {status === 'success' ? tEn.successTitle : (status === 'already' ? tEn.alreadyTitle : tEn.errorTitle)}
                    </h2>
                    <p className={styles.messageEn}>
                        {status === 'success' ? tEn.successText : (status === 'already' ? tEn.alreadyText : tEn.errorText)}
                    </p>
                </div>

                {status === 'error' && errorMsg && (
                    <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7, color: '#ff4444' }}>
                        {errorMsg}
                    </span>
                )}

                <Link href="/login" className={`${styles.loginBtn} btn-luxury w-100`}>
                    <span>{lang === 'ar' ? tAr.loginBtn : tEn.loginBtn}</span>
                </Link>

                <Link href="/" className={styles.backHome}>
                    {lang === 'ar' ? tAr.backHome : tEn.backHome}
                </Link>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div style={{ 
                background: '#000', 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <div className="loader-gold" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
