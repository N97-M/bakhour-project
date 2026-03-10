'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import {
    Save,
    MessageCircle,
    Megaphone,
    Globe,
    RefreshCw
} from 'lucide-react';
import styles from './AdminSettings.module.css';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        whatsapp: { number: '', enabled: true },
        announcement: { text_en: '', text_ar: '', active: true }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        const { data } = await supabase.from('site_config').select('*');

        if (data) {
            const newSettings = { ...settings };
            data.forEach(item => {
                newSettings[item.key] = item.value;
            });
            setSettings(newSettings);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (key, value) => {
        setSaving(true);
        const { error } = await supabase
            .from('site_config')
            .upsert({ key, value });

        if (error) alert('Error: ' + error.message);
        else {
            alert(`${key.charAt(0).toUpperCase() + key.slice(1)} settings updated!`);
            fetchSettings();
        }
        setSaving(false);
    };

    if (loading) return <div className="gold-text">Loading configuration...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <MessageCircle size={24} color="#C6A75E" />
                    <div>
                        <h3>WhatsApp Contact</h3>
                        <p>Manage the primary contact number for customer inquiries.</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.formGroup}>
                        <label>WhatsApp Number (With country code, e.g. 971...)</label>
                        <input
                            type="text"
                            value={settings.whatsapp.number}
                            onChange={e => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, number: e.target.value } })}
                        />
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="wa_enabled"
                            checked={settings.whatsapp.enabled}
                            onChange={e => setSettings({ ...settings, whatsapp: { ...settings.whatsapp, enabled: e.target.checked } })}
                        />
                        <label htmlFor="wa_enabled">Show WhatsApp button on website</label>
                    </div>
                    <button
                        className={styles.saveBtn}
                        onClick={() => handleSave('whatsapp', settings.whatsapp)}
                        disabled={saving}
                    >
                        <Save size={18} /> Update WhatsApp
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Megaphone size={24} color="#C6A75E" />
                    <div>
                        <h3>Announcement Bar</h3>
                        <p>Update the luxury promotional banner at the top of the site.</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Banner Text (English)</label>
                            <input
                                type="text"
                                value={settings.announcement.text_en}
                                onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, text_en: e.target.value } })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Banner Text (Arabic)</label>
                            <input
                                type="text"
                                value={settings.announcement.text_ar}
                                onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, text_ar: e.target.value } })}
                            />
                        </div>
                    </div>
                    <div className={styles.checkboxGroup}>
                        <input
                            type="checkbox"
                            id="ann_active"
                            checked={settings.announcement.active}
                            onChange={e => setSettings({ ...settings, announcement: { ...settings.announcement, active: e.target.checked } })}
                        />
                        <label htmlFor="ann_active">Make banner visible to customers</label>
                    </div>
                    <button
                        className={styles.saveBtn}
                        onClick={() => handleSave('announcement', settings.announcement)}
                        disabled={saving}
                    >
                        <Save size={18} /> Update Banner
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <RefreshCw size={24} color="#C6A75E" />
                    <div>
                        <h3>Cache & Sync</h3>
                        <p>Force refresh of site metadata and static content.</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <button className={styles.outlineBtn} onClick={fetchSettings}>
                        <RefreshCw size={18} /> Sync with Database
                    </button>
                </div>
            </div>
        </div>
    );
}
