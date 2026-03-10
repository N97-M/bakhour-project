'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import styles from '../login/auth.module.css';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (resetError) {
            setError(resetError.message);
        } else {
            setMessage('Password reset instructions have been sent to your email.');
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>Account Recovery</p>
                    <h1 className={styles.title}>Reset Password</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {message && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{message}</p>}

                <form className={styles.form} onSubmit={handleReset}>
                    <p style={{ color: '#C8BFB2', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Enter your email address and we will send you a link to reset your password.
                    </p>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Remembered your password? <Link href="/login">Login</Link></p>
                    <Link href="/" className={styles.backLink}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
