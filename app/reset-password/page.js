'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import styles from '../login/auth.module.css';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // This page should only be accessed via the link sent to the user's email.
    // Supabase automatically handles the session token in the URL fragment.

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== repeatPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess('Your password has been securely updated. You can now log in.');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>Secure Your Account</p>
                    <h1 className={styles.title}>Create New Password</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {success && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</p>}

                <form className={styles.form} onSubmit={handleUpdatePassword}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">New Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="repeat-password">Repeat New Password</label>
                        <input
                            type="password"
                            id="repeat-password"
                            required
                            placeholder="Repeat new password"
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link href="/login" className={styles.backLink}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
}
