'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import {
    Save,
    MessageCircle,
    Megaphone,
    Globe,
    RefreshCw,
    Layers,
    Image as ImageIcon,
    UploadCloud,
    Loader2,
    Plus,
    Trash2
} from 'lucide-react';
import styles from './AdminSettings.module.css';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        whatsapp: { number: '', enabled: true },
        announcement: { text_en: '', text_ar: '', active: true },
        shipping_uae_flat: '25',
        shipping_intl_kg: '45',
        home_collections: [
            { id: 'bakhour', name_en: 'Bakhour', name_ar: 'البخور', image: '/product-hero.png' },
            { id: 'khamriyat', name_en: 'Khomrah', name_ar: 'الخمر', image: '/product-hero.png' },
            { id: 'mahlab', name_en: 'Mahlab', name_ar: 'محلب', image: '/product-hero.png' },
            { id: 'gifts', name_en: 'Packages & Gifts', name_ar: 'البكجات والهدايا', image: '/product-hero.png' },
            { id: 'bestSellers', name_en: 'Best Sellers', name_ar: 'الأكثر مبيعاً', image: '/product-hero.png' }
        ]
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(null); // Track which index is uploading

    const uploadToStorage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `col-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products') // Using the same bucket for simplicity
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleAddCollection = () => {
        const newId = `col-${Date.now()}`;
        const newCols = [...settings.home_collections, { id: newId, name_en: 'New Collection', name_ar: 'مجموعة جديدة', image: '/product-hero.png' }];
        setSettings({ ...settings, home_collections: newCols });
    };

    const handleDeleteCollection = (idx) => {
        if (!confirm('Are you sure you want to remove this collection?')) return;
        const newCols = settings.home_collections.filter((_, i) => i !== idx);
        setSettings({ ...settings, home_collections: newCols });
    };

    const handleFileUpload = async (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(idx);
        try {
            const url = await uploadToStorage(file);
            const newCols = [...settings.home_collections];
            newCols[idx].image = url;
            setSettings({ ...settings, home_collections: newCols });
        } catch (err) {
            alert('Upload failed: ' + err.message);
        } finally {
            setUploading(null);
        }
    };

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase.from('site_config').select('*');

        if (data) {
            setSettings(prev => {
                const updated = { ...prev };
                data.forEach(item => {
                    updated[item.key] = item.value;
                });
                return updated;
            });
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

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
                    <Globe size={24} color="#C6A75E" />
                    <div>
                        <h3>Shipping Rates</h3>
                        <p>Configure delivery fees for local and international orders.</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>UAE Flat Rate (AED)</label>
                            <input
                                type="number"
                                min="0"
                                value={settings.shipping_uae_flat}
                                onChange={e => setSettings({ ...settings, shipping_uae_flat: e.target.value })}
                            />
                            <p className={styles.uploadHint}>Fixed rate for all orders inside UAE.</p>
                        </div>
                        <div className={styles.formGroup}>
                            <label>International Rate (AED per KG)</label>
                            <input
                                type="number"
                                min="0"
                                value={settings.shipping_intl_kg}
                                onChange={e => setSettings({ ...settings, shipping_intl_kg: e.target.value })}
                            />
                            <p className={styles.uploadHint}>Rate multiplied by total cart weight.</p>
                        </div>
                    </div>
                    <button
                        className={styles.saveBtn}
                        onClick={async () => {
                            setSaving(true);
                            await supabase.from('site_config').upsert([
                                { key: 'shipping_uae_flat', value: settings.shipping_uae_flat },
                                { key: 'shipping_intl_kg', value: settings.shipping_intl_kg }
                            ]);
                            alert('Shipping rates updated!');
                            setSaving(false);
                            fetchSettings();
                        }}
                        disabled={saving}
                        style={{ marginTop: '1.5rem' }}
                    >
                        <Save size={18} /> Update Shipping Rates
                    </button>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Layers size={24} color="#C6A75E" />
                    <div>
                        <h3>Home Collections</h3>
                        <p>Customize names and images for the main categories on the homepage.</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.collectionsGrid}>
                        {settings.home_collections.map((col, idx) => (
                            <div key={col.id} className={styles.collectionItem}>
                                <div className={styles.itemHeader}>
                                    <div className={styles.itemTitle}>{col.id}</div>
                                    <button 
                                        className={styles.deleteBtn}
                                        onClick={() => handleDeleteCollection(idx)}
                                        title="Delete Collection"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>ID (Key)</label>
                                        <input
                                            type="text"
                                            value={col.id}
                                            onChange={e => {
                                                const newCols = [...settings.home_collections];
                                                newCols[idx].id = e.target.value;
                                                setSettings({ ...settings, home_collections: newCols });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Name (EN)</label>
                                        <input
                                            type="text"
                                            value={col.name_en}
                                            onChange={e => {
                                                const newCols = [...settings.home_collections];
                                                newCols[idx].name_en = e.target.value;
                                                setSettings({ ...settings, home_collections: newCols });
                                            }}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Name (AR)</label>
                                        <input
                                            type="text"
                                            value={col.name_ar}
                                            onChange={e => {
                                                const newCols = [...settings.home_collections];
                                                newCols[idx].name_ar = e.target.value;
                                                setSettings({ ...settings, home_collections: newCols });
                                            }}
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.span2}`}>
                                        <label>Collection Image</label>
                                        <div className={styles.imageRow}>
                                            {col.image ? (
                                                <div className={styles.imagePreview}>
                                                    <img 
                                                        src={col.image} 
                                                        alt="preview" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                </div>
                                            ) : (
                                                <div className={styles.imagePreview} style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(200, 191, 178, 0.3)' }}>
                                                    <ImageIcon size={30} color="rgba(200, 191, 178, 0.3)" />
                                                </div>
                                            )}
                                            
                                            <div className={styles.uploadControls}>
                                                <input
                                                    type="file"
                                                    id={`upload-${col.id}`}
                                                    hidden
                                                    accept="image/*"
                                                    onChange={e => handleFileUpload(e, idx)}
                                                />
                                                <div className={styles.uploadBtnGroup}>
                                                    <button
                                                        type="button"
                                                        className="btn-luxury"
                                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                                        onClick={() => document.getElementById(`upload-${col.id}`).click()}
                                                        disabled={uploading === idx}
                                                    >
                                                        {uploading === idx ? <Loader2 className="spin" size={16} /> : <UploadCloud size={16} />}
                                                        <span style={{ marginLeft: '8px' }}>{uploading === idx ? 'Uploading...' : 'Upload Image'}</span>
                                                    </button>
                                                    {col.image && (
                                                        <input 
                                                            type="text" 
                                                            value={col.image}
                                                            readOnly
                                                            className={styles.imageUrlInput}
                                                            style={{ fontSize: '0.75rem', opacity: 0.5, background: 'transparent', border: 'none', cursor: 'default' }}
                                                        />
                                                    )}
                                                </div>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(200, 191, 178, 0.5)', marginTop: '0.5rem' }}>
                                                    Recommended: Square image (1:1), high resolution.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={styles.addBtn}
                        onClick={handleAddCollection}
                    >
                        <Plus size={20} />
                        Add New Collection
                    </button>
                    <button
                        className={styles.saveBtn}
                        onClick={() => handleSave('home_collections', settings.home_collections)}
                        disabled={saving}
                        style={{ marginTop: '2rem' }}
                    >
                        <Save size={18} /> Update Home Collections
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
