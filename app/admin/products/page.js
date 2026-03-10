'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    AlertTriangle,
    CheckCircle,
    X
} from 'lucide-react';
import styles from './AdminProducts.module.css';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name_en: '', name_ar: '',
        price: '', category_en: '', category_ar: '',
        stock_quantity: 10, is_featured: false,
        notes_en: '', notes_ar: '',
        desc_en: '', desc_ar: '',
        image_url: '/product-hero.png'
    });

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        setSelectedFile(null);
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product });
            setImagePreview(product.image_url);
        } else {
            setEditingProduct(null);
            setFormData({
                name_en: '', name_ar: '',
                price: '', category_en: '', category_ar: '',
                stock_quantity: 10, is_featured: false,
                notes_en: '', notes_ar: '',
                desc_en: '', desc_ar: '',
                image_url: '/product-hero.png'
            });
            setImagePreview('/product-hero.png');
        }
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                image_url: finalImageUrl
            };

            let error;
            if (editingProduct) {
                const { error: err } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
                error = err;
            } else {
                const { error: err } = await supabase.from('products').insert([payload]);
                error = err;
            }

            if (error) {
                alert('Error saving product: ' + error.message);
            } else {
                setShowModal(false);
                fetchProducts();
            }
        } catch (err) {
            alert('Upload Error: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert('Error deleting: ' + error.message);
        else fetchProducts();
    };

    const filteredProducts = products.filter(p =>
        p.name_en.toLowerCase().includes(search.toLowerCase()) ||
        p.name_ar.includes(search)
    );

    return (
        <div className={styles.container}>
            <div className={styles.actionBar}>
                <div className={styles.searchWrapper}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button onClick={() => handleOpenModal()} className={styles.addBtn}>
                    <Plus size={18} /> <span>New Product</span>
                </button>
            </div>

            {loading ? (
                <div className="gold-text">Loading inventory...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id}>
                                    <td className={styles.productCell}>
                                        <Image
                                            src={p.image_url || '/product-hero.png'}
                                            alt={p.name_en}
                                            width={40}
                                            height={40}
                                            className={styles.productImg}
                                        />
                                        <div className={styles.nameGrp}>
                                            <span className={styles.enName}>{p.name_en}</span>
                                            <span className={styles.arName}>{p.name_ar}</span>
                                        </div>
                                    </td>
                                    <td>{p.category_en}</td>
                                    <td>{p.price} AED</td>
                                    <td>
                                        <div className={p.stock_quantity < 5 ? styles.lowStock : styles.inStock}>
                                            {p.stock_quantity < 5 ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                                            {p.stock_quantity}
                                        </div>
                                    </td>
                                    <td>
                                        {p.is_featured && <span className={styles.featuredBadge}>Featured</span>}
                                    </td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleOpenModal(p)} className={styles.editBtn}><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeBtn}><X /></button>
                        </div>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.imageUploadSection}>
                                    <label>Product Photo</label>
                                    <div className={styles.imagePreviewWrapper}>
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={200}
                                            height={200}
                                            className={styles.previewImage}
                                        />
                                        <div className={styles.uploadControls}>
                                            <label htmlFor="product-image" className={styles.fileLabel}>
                                                {selectedFile ? 'Change Selected' : 'Upload New Photo'}
                                            </label>
                                            <input
                                                type="file"
                                                id="product-image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className={styles.fileInput}
                                            />
                                            <p className={styles.uploadHint}>JPG, PNG or WebP. Max 5MB.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Name (English)</label>
                                    <input required value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Name (Arabic)</label>
                                    <input required value={formData.name_ar} onChange={e => setFormData({ ...formData, name_ar: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Price (AED)</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Stock Quantity</label>
                                    <input required type="number" value={formData.stock_quantity} onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category (EN)</label>
                                    <input value={formData.category_en} onChange={e => setFormData({ ...formData, category_en: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Category (AR)</label>
                                    <input value={formData.category_ar} onChange={e => setFormData({ ...formData, category_ar: e.target.value })} />
                                </div>
                                <div className={styles.formGroupFull}>
                                    <label>Description (EN)</label>
                                    <textarea value={formData.desc_en} onChange={e => setFormData({ ...formData, desc_en: e.target.value })} />
                                </div>
                                <div className={styles.formGroupFull}>
                                    <label>Description (AR)</label>
                                    <textarea value={formData.desc_ar} onChange={e => setFormData({ ...formData, desc_ar: e.target.value })} />
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <input type="checkbox" id="featured" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} />
                                    <label htmlFor="featured">Feature this product on homepage</label>
                                </div>
                            </div>
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                                <button type="submit" disabled={isSaving} className={styles.saveBtn}>
                                    {isSaving ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
