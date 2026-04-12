'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Plus, Pencil, Trash2, Globe, X } from 'lucide-react';
import styles from './AdminCountries.module.css';

const defaultForm = { name: '', code: '', shipping_price: '', is_active: true };

export default function AdminCountriesPage() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(defaultForm);
    const [isSaving, setIsSaving] = useState(false);

    const fetchCountries = async () => {
        setLoading(true);
        const res = await fetch('/api/admin/countries');
        const data = await res.json();
        setCountries(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchCountries(); }, []);

    const openAdd = () => {
        setForm(defaultForm);
        setEditingId(null);
        setShowModal(true);
    };

    const openEdit = (country) => {
        setForm({
            name: country.name,
            code: country.code,
            shipping_price: country.shipping_price,
            is_active: country.is_active
        });
        setEditingId(country.id);
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId ? { id: editingId, ...form } : form;

            const res = await fetch('/api/admin/countries', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save');

            setShowModal(false);
            fetchCountries();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        await fetch(`/api/admin/countries?id=${id}`, { method: 'DELETE' });
        fetchCountries();
    };

    return (
        <div className={styles.container}>
            <div className={styles.actionBar}>
                <h2 className={styles.title}>
                    <Globe size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Shipping Countries
                </h2>
                <button onClick={openAdd} className={styles.addBtn}>
                    <Plus size={18} /> <span>Add Country</span>
                </button>
            </div>

            {loading ? (
                <p className={styles.empty}>Loading countries...</p>
            ) : countries.length === 0 ? (
                <p className={styles.empty}>No countries added yet. Click "Add Country" to get started.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Country Name</th>
                            <th>Code</th>
                            <th>Shipping Price (AED)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {countries.map(c => (
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>{c.code}</td>
                                <td>{Number(c.shipping_price).toFixed(2)} AED</td>
                                <td>
                                    <span className={c.is_active ? styles.badgeActive : styles.badgeInactive}>
                                        {c.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button onClick={() => openEdit(c)} className={styles.editBtn} title="Edit">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => handleDelete(c.id, c.name)} className={styles.deleteBtn} title="Delete">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>{editingId ? 'Edit Country' : 'Add Country'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Country Name</label>
                                    <input
                                        required
                                        placeholder="e.g. Jordan"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Country Code</label>
                                    <input
                                        required
                                        placeholder="e.g. JO"
                                        maxLength={4}
                                        value={form.code}
                                        onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Shipping Price (AED)</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 35"
                                    value={form.shipping_price}
                                    onChange={e => setForm({ ...form, shipping_price: e.target.value })}
                                />
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={form.is_active}
                                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                />
                                <label htmlFor="is_active">Active (visible in checkout)</label>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSaving} className={styles.saveBtn}>
                                    {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Country'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
