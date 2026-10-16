'use client';
import { useEffect, useState, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { Check, Package, Home, ArrowRight, Heart } from 'lucide-react';
import styles from './page.module.css';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { lang } = useLanguage();
    const { clearCart } = useCart();
    const orderId = searchParams.get('orderId');
    const sessionId = searchParams.get('session_id');
    const t = translations[lang].checkout;
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        if (!orderId) {
            router.push('/');
            return;
        }

        clearCart();

        // Automatically confirm and update the order in Supabase
        const confirmOrder = async () => {
            try {
                await fetch('/api/checkout/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId, sessionId })
                });
            } catch (err) {
                console.error('Error confirming order:', err);
            } finally {
                setVerifying(false);
            }
        };

        confirmOrder();
    }, [orderId, sessionId, router, clearCart]);

    return (
        <div className={styles.successCard}>
            <div className={styles.iconWrapper}>
                <div className={styles.checkCircle}>
                    <Check size={48} color="#000" strokeWidth={3} />
                </div>
                <div className={styles.sparkle} />
                <div className={styles.sparkle2} />
            </div>

            <h1 className={styles.title}>{t.success}</h1>
            <p className={styles.thankyou}>{t.thankyou}</p>

            <div className={styles.orderInfo}>
                <div className={styles.infoRow}>
                    <span>{lang === 'en' ? 'Order ID' : 'رقم الطلب'}</span>
                    <span className="gold-text">#{orderId?.slice(-8).toUpperCase()}</span>
                </div>
                <div className={styles.infoRow}>
                    <span>{lang === 'en' ? 'Status' : 'الحالة'}</span>
                    <span className={styles.statusBadge}>{lang === 'en' ? 'Confirmed' : 'تم التأكيد'}</span>
                </div>
            </div>

            <div className={styles.nextSteps}>
                <h3>{lang === 'en' ? 'What Happens Next?' : 'ماذا يحدث الآن؟'}</h3>
                <div className={styles.step}>
                    <Package size={20} color="#C6A75E" />
                    <p>{lang === 'en' ? 'We are preparing your handcrafted bakhoor for shipment.' : 'نحن نقوم بتجهيز البخور الخاص بك للشحن بكل عناية.'}</p>
                </div>
                <div className={styles.step}>
                    <Heart size={20} color="#C6A75E" />
                    <p>{lang === 'en' ? 'You will receive an update once your order is on its way.' : 'ستصلك رسالة تحديث بمجرد خروج طلبك للتوصيل.'}</p>
                </div>
            </div>

            <div className={styles.actions}>
                <button onClick={() => router.push('/')} className="btn-luxury">
                    <Home size={18} />
                    <span>{lang === 'en' ? 'Back to Home' : 'العودة للرئيسية'}</span>
                </button>
                <button onClick={() => router.push('/gallery')} className={styles.outlineBtn}>
                    <span>{lang === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <section className="container">
                    <Suspense fallback={<div className="gold-text center">Loading success data...</div>}>
                        <SuccessContent />
                    </Suspense>
                </section>
            </main>
            <Footer />
        </>
    );
}
