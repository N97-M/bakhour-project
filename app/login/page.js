'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import styles from './auth.module.css';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            // Login successful
            router.push('/');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>Welcome Back</p>
                    <h1 className={styles.title}>Login</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label htmlFor="password">Password</label>
                            <Link href="/forgot-password" style={{ fontSize: '0.75rem', color: '#C6A75E', textDecoration: 'underline' }}>Forgot Password?</Link>
                        </div>
                        <input type="password" id="password" required placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? 'Logging in...' : 'Login'}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Don&apos;t have an account? <Link href="/signup">Sign up</Link></p>
                    <Link href="/" className={styles.backLink}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
