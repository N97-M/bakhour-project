import styles from '../login/auth.module.css';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { lang } = useLanguage();
    const t = translations[lang].auth.reset;

    // This page should only be accessed via the link sent to the user's email.
    // Supabase automatically handles the session token in the URL fragment.

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== repeatPassword) {
            return setError(t.errorMismatch);
        }

        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccess(t.success);
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
                    <p className={styles.overline}>{t.overline}</p>
                    <h1 className={styles.title}>{t.title}</h1>
                </div>

                {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}
                {success && <p style={{ color: '#C6A75E', textAlign: 'center', marginBottom: '1rem', fontSize: '0.85rem' }}>{success}</p>}

                <form className={styles.form} onSubmit={handleUpdatePassword}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t.password}</label>
                        <input
                            type="password"
                            id="password"
                            required
                            placeholder={t.passwordPlaceholder}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="repeat-password">{t.repeatPassword}</label>
                        <input
                            type="password"
                            id="repeat-password"
                            required
                            placeholder={t.repeatPasswordPlaceholder}
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className={`btn-luxury ${styles.submitBtn}`} disabled={loading}>
                        <span>{loading ? t.loading : t.submit}</span>
                    </button>
                </form>

                <div className={styles.footer}>
                    <Link href="/login" className={styles.backLink}>{t.backLogin}</Link>
                </div>
            </div>
        </div>
    );
}
