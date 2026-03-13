'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import {
    Plus,
    Trash2,
    Tag,
    Calendar,
    DollarSign,
    Percent,
    X,
    Filter,
    Save,
    Megaphone
} from 'lucide-react';
import styles from './AdminCoupons.module.css';

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_value: 0,
        active: true,
        expiry_date: ''
    });
    const [promoSettings, setPromoSettings] = useState({
        active: false,
        title_en: '',
        title_ar: '',
        text_en: '',
        text_ar: '',
        code: '',
        discount: 10
    });

    const fetchCoupons = async () => {
        setLoading(true);
        // Fetch Coupons
        const { data: couponsData } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (couponsData) setCoupons(couponsData);

        // Fetch Promo Popup Settings
        const { data: configData } = await supabase.from('site_config').select('*').eq('key', 'promo_popup').single();
        if (configData) {
            setPromoSettings(configData.value);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const { error } = await supabase.from('coupons').insert([{
            ...formData,
            discount_value: parseFloat(formData.discount_value),
            min_order_value: parseFloat(formData.min_order_value),
            expiry_date: formData.expiry_date || null
        }]);

        if (error) {
            alert('Error: ' + error.message);
        } else {
            setShowModal(false);
            fetchCoupons();
        }
        setIsSaving(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this coupon?')) return;
        await supabase.from('coupons').delete().eq('id', id);
        fetchCoupons();
    };

    const handleSavePromo = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('site_config')
            .upsert({ key: 'promo_popup', value: promoSettings });

        // Also ensure the coupon exists or is updated in the coupons table
        if (!error && promoSettings.code) {
            await supabase.from('coupons').upsert({
                code: promoSettings.code.toUpperCase(),
                discount_type: 'percentage',
                discount_value: parseFloat(promoSettings.discount),
                active: promoSettings.active,
                min_order_value: 0
            }, { onConflict: 'code' });
        }

        if (error) alert('Error: ' + error.message);
        else alert('Promo popup settings updated!');
        
        setIsSaving(false);
        fetchCoupons();
    };

    return (
        <div className={styles.container}>
            <div className={styles.settingsSection}>
                <div className={styles.settingsHeader}>
                    <Megaphone size={24} color="#C6A75E" />
                    <div>
                        <h3>First Order Promotional Popup</h3>
                        <p>Configure the high-conversion welcome offer for new customers.</p>
                    </div>
                </div>

                <div className={styles.settingsGrid}>
                    <div className={styles.checkboxGroup} style={{ gridColumn: 'span 2' }}>
                        <input
                            type="checkbox"
                            id="promo_active"
                            checked={promoSettings.active}
                            onChange={(e) => setPromoSettings({ ...promoSettings, active: e.target.checked })}
                        />
                        <label htmlFor="promo_active">Enable welcome popup for first-time visitors</label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Popup Title (English)</label>
                        <input
                            type="text"
                            value={promoSettings.title_en}
                            onChange={(e) => setPromoSettings({ ...promoSettings, title_en: e.target.value })}
                            placeholder="e.g. 10% OFF Your First Order"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Popup Title (Arabic)</label>
                        <input
                            type="text"
                            value={promoSettings.title_ar}
                            onChange={(e) => setPromoSettings({ ...promoSettings, title_ar: e.target.value })}
                            placeholder="مثال: خصم ١٠٪ على طلبك الأول"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Message (English)</label>
                        <input
                            type="text"
                            value={promoSettings.text_en}
                            onChange={(e) => setPromoSettings({ ...promoSettings, text_en: e.target.value })}
                            placeholder="Use this promo code at checkout"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Message (Arabic)</label>
                        <input
                            type="text"
                            value={promoSettings.text_ar}
                            onChange={(e) => setPromoSettings({ ...promoSettings, text_ar: e.target.value })}
                            placeholder="استخدم كود الخصم هذا عند الدفع"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Promo Code</label>
                        <input
                            type="text"
                            value={promoSettings.code}
                            onChange={(e) => setPromoSettings({ ...promoSettings, code: e.target.value.toUpperCase() })}
                            placeholder="FIRST10"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Discount Percentage (%)</label>
                        <input
                            type="number"
                            value={promoSettings.discount}
                            onChange={(e) => setPromoSettings({ ...promoSettings, discount: e.target.value })}
                            placeholder="10"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSavePromo}
                    disabled={isSaving}
                    className={styles.saveBtnSmall}
                >
                    <Save size={18} />
                    {isSaving ? 'Updating...' : 'Update Popup Settings'}
                </button>
            </div>

            <div className={styles.actionBar}>
                <h2 className={styles.secTitle}>Active & Scheduled Coupons</h2>
                <button onClick={() => setShowModal(true)} className={styles.addBtn}>
                    <Plus size={18} /> <span>Create New Coupon</span>
                </button>
            </div>

            {loading ? <div className="gold-text">Fetching codes...</div> : (
                <div className={styles.couponGrid}>
                    {coupons.map(c => (
                        <div key={c.id} className={styles.couponCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.codeWrap}>
                                    <Tag size={16} color="#C6A75E" />
                                    <span className={styles.code}>{c.code}</span>
                                </div>
                                <button onClick={() => handleDelete(c.id)} className={styles.deleteBtn}>
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.discount}>
                                    {c.discount_type === 'percentage' ? <Percent size={20} /> : <DollarSign size={20} />}
                                    <span>{c.discount_value}{c.discount_type === 'percentage' ? '%' : ' AED'} OFF</span>
                                </div>
                                <div className={styles.meta}>
                                    <div className={styles.metaItem}>
                                        <Filter size={14} />
                                        <span>Min Order: {c.min_order_value} AED</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                        <Calendar size={14} />
                                        <span>Expires: {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'Never'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={c.active ? styles.activeStatus : styles.inactiveStatus}>
                                {c.active ? 'Active' : 'Expired / Inactive'}
                            </div>
                        </div>
                    ))}
                    {coupons.length === 0 && <p className={styles.empty}>No coupons created yet.</p>}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Create Coupon</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X /></button>
                        </div>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Coupon Code (e.g. RAMADAN50)</label>
                                <input required placeholder="VIP20" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Type</label>
                                    <select value={formData.discount_type} onChange={e => setFormData({ ...formData, discount_type: e.target.value })}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (AED)</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Value</label>
                                    <input required type="number" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Minimum Order Value (AED)</label>
                                <input type="number" value={formData.min_order_value} onChange={e => setFormData({ ...formData, min_order_value: e.target.value })} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Expiry Date (Optional)</label>
                                <input type="date" value={formData.expiry_date} onChange={e => setFormData({ ...formData, expiry_date: e.target.value })} />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="submit" disabled={isSaving} className={styles.saveBtn}>
                                    {isSaving ? 'Creating...' : 'Generate Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
