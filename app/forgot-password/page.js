import styles from '../login/auth.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { lang } = useLanguage();
    const t = translations[lang].auth.forgot;

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
            setMessage(t.success);
        }
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.header}>
                    <p className={styles.overline}>{t.overline}</p>
                    <h1 className={styles.title}>{t.title}</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {message && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{message}</p>}

                <form className={styles.form} onSubmit={handleReset}>
                    <p style={{ color: '#C8BFB2', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {t.description}
                    </p>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t.email}</label>
                        <input
                            type="email"
                            id="email"
                            required
                            placeholder={t.emailPlaceholder}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
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
