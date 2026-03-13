'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import styles from '../login/auth.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [newsletter, setNewsletter] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { lang } = useLanguage();
    const t = translations[lang].auth.signup;

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== repeatPassword) {
            return setError(t.errorMismatch);
        }

        setLoading(true);

        try {
            console.log('Attempting signup for:', email);
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        wants_newsletter: newsletter,
                    },
                    // Some Supabase versions use redirectTo, others use emailRedirectTo. 
                    // Providing both ensures the developer dashboard settings are respected.
                    emailRedirectTo: `${window.location.origin}/verify`,
                }
            });

            console.log('Auth result:', { data, error: authError });

            if (authError) {
                console.error('Signup error:', authError);
                setError(authError.message || t.errorGeneral || 'An error occurred. Please try again.');
            } else if (data?.user && data?.session) {
                // Already logged in (likely email confirmation off)
                setSuccess(t.success);
                setTimeout(() => router.push('/'), 2000);
            } else {
                // Confirmation email sent
                setSuccess(t.success + " Check your inbox and spam folder.");
            }
        } catch (err) {
            console.error('Unexpected signup error:', err);
            setError('Network error: Could not reach authentication service. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>{t.overline}</p>
                    <h1 className={styles.title}>{t.title}</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {success && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</p>}

                <form className={styles.form} onSubmit={handleSignup}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">{t.name}</label>
                        <input type="text" id="name" required placeholder={t.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t.email}</label>
                        <input type="email" id="email" required placeholder={t.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t.password}</label>
                        <input type="password" id="password" required placeholder={t.passwordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="repeat-password">{t.repeatPassword}</label>
                        <input type="password" id="repeat-password" required placeholder={t.repeatPasswordPlaceholder} value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="newsletter" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
                        <label htmlFor="newsletter">{t.newsletter}</label>
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? t.loading : t.submit}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>{t.loginPrompt} <Link href="/login">{t.loginLink}</Link></p>
                    <Link href="/" className={styles.backLink}>{t.backHome}</Link>
                </div>
            </div>
        </div>
    );
}
