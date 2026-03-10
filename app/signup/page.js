'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import styles from '../login/auth.module.css';
import Link from 'next/link';

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

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== repeatPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    wants_newsletter: newsletter,
                }
            }
        });

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess('Account created! Please check your email to verify your account before logging in.');
            // Optionally redirect instantly if email confirmation is off in Supabase:
            // router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>Join the Legacy</p>
                    <h1 className={styles.title}>Create Account</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {success && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</p>}

                <form className={styles.form} onSubmit={handleSignup}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" required placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" required placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="repeat-password">Repeat Password</label>
                        <input type="password" id="repeat-password" required placeholder="Repeat your password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="newsletter" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} />
                        <label htmlFor="newsletter">Send me emails when new products are added.</label>
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? 'Creating...' : 'Sign Up'}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Already have an account? <Link href="/login">Login</Link></p>
                    <Link href="/" className={styles.backLink}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
