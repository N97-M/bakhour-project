'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { X, Tag, ClipboardCheck, Gift } from 'lucide-react';
import styles from './PromoPopup.module.css';

export default function PromoPopup() {
    const pathname = usePathname();
    const { lang } = useLanguage();
    const [config, setConfig] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Only show on the homepage
        if (pathname !== '/' && pathname !== '/ar' && pathname !== '/en') return;
        const fetchConfig = async () => {
            // 1. Check if already dismissed in this session
            const dismissed = sessionStorage.getItem('promo-dismissed');
            if (dismissed) return;

            // 2. Fetch config from Supabase
            const { data, error } = await supabase
                .from('site_config')
                .select('*')
                .eq('key', 'promo_popup')
                .single();

            if (data && data.value && data.value.active) {
                setConfig(data.value);
                // Delay showing by 1.5 seconds for better experience
                setTimeout(() => {
                    setIsVisible(true);
                }, 1500);
            }
        };

        fetchConfig();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('promo-dismissed', 'true');
    };

    const handleCopy = () => {
        if (!config || !config.code) return;
        navigator.clipboard.writeText(config.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isVisible || !config) return null;

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={handleClose} aria-label="Close popup">
                    <X size={24} />
                </button>

                <div className={styles.iconWrap}>
                    <div style={{ background: 'rgba(198, 167, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                        <Gift size={40} color="#C6A75E" strokeWidth={1.5} />
                    </div>
                </div>

                <h2 className={styles.title}>
                    {lang === 'en' ? config.title_en : config.title_ar}
                </h2>
                
                <p className={styles.text}>
                    {lang === 'en' ? config.text_en : config.text_ar}
                </p>

                <div className={styles.codeBox} onClick={handleCopy}>
                    <span className={styles.codeLabel}>
                        {lang === 'en' ? 'Promo Code' : 'كود الخصم'}
                    </span>
                    <span className={styles.code}>{config.code}</span>
                    <div className={styles.copyHint}>
                        {copied ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#44ff44' }}>
                                <ClipboardCheck size={14} />
                                <span>{lang === 'en' ? 'Copied to clipboard' : 'تم النسخ بنجاح'}</span>
                            </div>
                        ) : (
                            <span>{lang === 'en' ? 'Click to copy code' : 'اضغط لنسخ الكود'}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
