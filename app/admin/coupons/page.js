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
    Filter
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

    const fetchCoupons = async () => {
        setLoading(true);
        const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (data) setCoupons(data);
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

    return (
        <div className={styles.container}>
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
