'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { supabase } from '@/utils/supabase';
import {
    ChevronRight,
    Gift,
    Truck,
    ShieldCheck,
    ArrowRight,
    Loader2
} from 'lucide-react';
import styles from './page.module.css';

export default function CheckoutPage() {
    const { cart, cartTotal, finalTotal: cartFinalTotal, cartDiscount, couponDiscount, appliedCoupon, clearCart, isLoaded } = useCart();
    const { lang } = useLanguage();
    const router = useRouter();
    const t = translations[lang].checkout;

    const [shippingRates, setShippingRates] = useState({ uae: 25, intl: 45 });
    const [shippingNote, setShippingNote] = useState(null);
    const [shippingNoteText, setShippingNoteText] = useState(null);
    const [calculatedShipping, setCalculatedShipping] = useState(0);
    const [countries, setCountries] = useState([]);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        is_gift: false,
        gift_message: ''
    });

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [saveAddress, setSaveAddress] = useState(true);

    // Fetch User & Profile
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Fetch profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    setForm(prev => ({
                        ...prev,
                        name: profile.full_name || prev.name,
                        phone: profile.phone || prev.phone,
                        address: profile.address || prev.address,
                        city: profile.city || prev.city,
                        country: profile.country || prev.country || '',
                        email: session.user.email || prev.email
                    }));
                } else {
                    // Pre-fill email from session at least
                    setForm(prev => ({ ...prev, email: session.user.email }));
                }
            }
        };
        checkUser();
    }, []);

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.push('/cart');
        }
    }, [cart, isLoaded, router]);

    // Fetch Rates, Settings & Active Countries
    useEffect(() => {
        const fetchRates = async () => {
            const { data } = await supabase.from('site_config').select('*').in('key', ['shipping_uae_flat', 'shipping_intl_kg', 'announcement', 'shipping_note']);
            if (data) {
                const rates = { uae: 25, intl: 45 };
                let ann = null;
                data.forEach(row => {
                    if (row.key === 'shipping_uae_flat') rates.uae = Number(row.value);
                    if (row.key === 'shipping_intl_kg') rates.intl = Number(row.value);
                    if (row.key === 'announcement') ann = row.value;
                    if (row.key === 'shipping_note') setShippingNoteText(row.value);
                });
                setShippingRates(rates);
                if (ann) setShippingNote(ann);
            }
        };
        const fetchCountries = async () => {
            const res = await fetch('/api/admin/countries');
            const data = await res.json();
            if (Array.isArray(data)) {
                const active = data.filter(c => c.is_active);
                setCountries(active);
                setForm(prev => {
                    if (!prev.country && active.length > 0) {
                        const uae = active.find(c => c.code === 'AE' || c.name === 'United Arab Emirates') || active[0];
                        return { ...prev, country: uae.name };
                    }
                    return prev;
                });
            }
        };
        fetchRates();
        fetchCountries();
    }, []);

    // Calculate Shipping from DB country record or site_config flat rate for UAE
    useEffect(() => {
        if (!form.country) {
            setCalculatedShipping(0);
            return;
        }

        const isUAE = form.country === 'United Arab Emirates' || form.country === 'UAE' || form.country === 'الإمارات العربية المتحدة';
        const selected = countries.find(c => c.name === form.country || (isUAE && c.code === 'AE'));

        if (isUAE) {
            // Prioritize the configured shipping rate from site_config, fall back to country table price or default 25
            const uaeRate = (shippingRates.uae !== undefined && shippingRates.uae !== null)
                ? Number(shippingRates.uae)
                : (selected ? Number(selected.shipping_price) : 25);
            setCalculatedShipping(uaeRate);
        } else if (selected) {
            setCalculatedShipping(Number(selected.shipping_price));
        } else {
            setCalculatedShipping(0);
        }
    }, [form.country, countries, shippingRates]);

    // Add shipping to the original cart final total
    const grandTotal = cartFinalTotal + calculatedShipping;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save Profile if requested and user is logged in
            if (user && saveAddress) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: form.name,
                        phone: form.phone,
                        address: form.address,
                        city: form.city,
                        country: form.country,
                        updated_at: new Date().toISOString()
                    });
                if (profileError) console.error('Error saving profile:', profileError);
            }

            // 1. Call our API Route
            const res = await fetch('/api/checkout/ziina', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form,
                    cart,
                    finalTotal: grandTotal,
                    shippingCost: calculatedShipping,
                    appliedCoupon, // Pass the coupon to the backend for validation
                    userId: user?.id || null
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to initialize payment');
            }

            const data = await res.json();

            // 2. Redirect User to Ziina Payment Page
            window.location.href = data.url;

        } catch (err) {
            alert('Checkout Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) return null;

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.checkoutGrid}>
                        {/* Form Section */}
                        <section className={styles.formSection}>
                            <h1 className={styles.pageTitle}>{lang === 'en' ? 'Checkout' : 'إتمام الطلب'}</h1>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.fieldSection}>
                                    <h3 className={styles.fieldTitle}>
                                        <Truck size={20} color="#C6A75E" />
                                        <span>{lang === 'en' ? 'Shipping Information' : 'معلومات الشحن'}</span>
                                    </h3>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
                                            <input
                                                required
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
                                            <input
                                                required
                                                value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'Country' : 'الدولة'}</label>
                                            <select
                                                required
                                                value={form.country}
                                                onChange={e => setForm({ ...form, country: e.target.value, city: '' })}
                                            >
                                                <option value="">{lang === 'en' ? 'Select Country' : 'اختر الدولة'}</option>
                                                {countries.map(c => (
                                                    <option key={c.id} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'City' : 'المدينة'}</label>
                                            {form.country === 'United Arab Emirates' ? (
                                                <select
                                                    required
                                                    value={form.city}
                                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                                >
                                                    <option value="">{lang === 'en' ? 'Select City' : 'اختر المدينة'}</option>
                                                    <option value="Dubai">Dubai</option>
                                                    <option value="Abu Dhabi">Abu Dhabi</option>
                                                    <option value="Sharjah">Sharjah</option>
                                                    <option value="Ajman">Ajman</option>
                                                    <option value="RAK">Ras Al Khaimah</option>
                                                    <option value="Fujairah">Fujairah</option>
                                                    <option value="UAQ">Umm Al Quwain</option>
                                                    <option value="Al Ain">Al Ain</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder={lang === 'en' ? 'Enter your city' : 'أدخل مدينتك'}
                                                    value={form.city}
                                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                                />
                                            )}
                                        </div>
                                        <div className={`${styles.formGroup} ${styles.fullRow}`}>
                                            <label>{lang === 'en' ? 'Delivery Address (Apartment, Street, Landmark)' : 'عنوان التوصيل (الشقة، الشارع، علامة مميزة)'}</label>
                                            <textarea
                                                required
                                                value={form.address}
                                                onChange={e => setForm({ ...form, address: e.target.value })}
                                            />
                                        </div>

                                        {user && (
                                            <div className={styles.saveAddressToggle}>
                                                <input
                                                    type="checkbox"
                                                    id="save_address"
                                                    checked={saveAddress}
                                                    onChange={e => setSaveAddress(e.target.checked)}
                                                />
                                                <label htmlFor="save_address">{t.saveAddress}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.fieldSection}>
                                    <h3 className={styles.fieldTitle}>
                                        <Gift size={20} color="#C6A75E" />
                                        <span>{lang === 'en' ? 'Gift Options' : 'خيارات الهدايا'}</span>
                                    </h3>

                                    <div className={styles.giftToggle}>
                                        <input
                                            type="checkbox"
                                            id="is_gift"
                                            checked={form.is_gift}
                                            onChange={e => setForm({ ...form, is_gift: e.target.checked })}
                                        />
                                        <label htmlFor="is_gift">{lang === 'en' ? 'This is a gift order' : 'هذا الطلب عبارة عن هدية'}</label>
                                    </div>

                                    {form.is_gift && (
                                        <div className={styles.formGroup}>
                                            <label>{lang === 'en' ? 'Gift Message' : 'رسالة الهدية'}</label>
                                            <textarea
                                                placeholder={lang === 'en' ? 'Write something special...' : 'اكتب شيئاً مميزاً...'}
                                                value={form.gift_message}
                                                onChange={e => setForm({ ...form, gift_message: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${styles.submitBtn} btn-luxury w-100`}
                                >
                                    {loading ? <Loader2 className="spin" /> : (
                                        <>
                                            <span>{lang === 'en' ? 'Confirm Order' : 'تأكيد الطلب'}</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className={styles.secureBadge}>
                                    <ShieldCheck size={16} />
                                    <span>{lang === 'en' ? 'Secure Online Payment' : 'دفع إلكتروني آمن'}</span>
                                </div>
                            </form>
                        </section>

                        {/* Order Summary Section */}
                        <aside className={styles.summarySection}>
                            <div className={styles.summaryCard}>
                                <h2>{lang === 'en' ? 'Order Summary' : 'ملخص الطلب'}</h2>

                                {shippingNote && shippingNote.active && (
                                    <div className={styles.shippingNote}>
                                        <Truck size={20} />
                                        <span>{lang === 'en' ? shippingNote.text_en : shippingNote.text_ar}</span>
                                    </div>
                                )}

                                <div className={styles.itemsList}>
                                    {cart.map(item => (
                                        <div key={item.id} className={styles.summaryItem}>
                                            <div className={styles.itemDetail}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemQty}>x{item.quantity}</span>
                                            </div>
                                            <span className={styles.itemPrice}>
                                                {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)} AED
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.totals}>
                                    <div className={styles.row}>
                                        <span>{lang === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                                        <span>{cartTotal.toFixed(2)} AED</span>
                                    </div>
                                    {shippingNoteText && (shippingNoteText.text_en || shippingNoteText.text_ar) && (
                                        <div className={styles.row}>
                                            <span style={{ color: 'rgba(200, 191, 178, 0.5)', fontSize: '0.85rem' }}>{lang === 'en' ? 'International Shipping Note' : 'ملاحظة الشحن الدولي'}</span>
                                            <span style={{ color: '#C6A75E', fontSize: '0.85rem' }}>{lang === 'en' ? shippingNoteText.text_en : shippingNoteText.text_ar}</span>
                                        </div>
                                    )}
                                    <div className={styles.row}>
                                        <span>{lang === 'en' ? 'Shipping' : 'الشحن'}</span>
                                        {form.country ? (
                                            <span>{calculatedShipping.toFixed(2)} AED</span>
                                        ) : (
                                            <span className={styles.free}>{lang === 'en' ? 'Select Country' : 'اختر الدولة'}</span>
                                        )}
                                    </div>

                                    {cartDiscount > 0 && (
                                        <div className={`${styles.row} ${styles.discount}`}>
                                            <span>{lang === 'en' ? 'Quantity Discount' : 'خصم الكمية'}</span>
                                            <span>-{cartDiscount.toFixed(2)} AED</span>
                                        </div>
                                    )}

                                    {appliedCoupon && (
                                        <div className={`${styles.row} ${styles.discount}`}>
                                            <span>{lang === 'en' ? `Coupon (${appliedCoupon.code})` : `كوبون (${appliedCoupon.code})`}</span>
                                            <span>-{couponDiscount.toFixed(2)} AED</span>
                                        </div>
                                    )}

                                    <div className={styles.totalRow}>
                                        <span>{lang === 'en' ? 'Total' : 'الإجمالي'}</span>
                                        <span className="gold-text">{grandTotal.toFixed(2)} AED</span>
                                    </div>
                                </div>
                            </div>

                            <p className={styles.policyHint}>
                                {lang === 'en'
                                    ? 'By confirming your order, you agree to our terms of service and refund policy.'
                                    : 'بتأكيد طلبك، فإنك توافق على شروط الخدمة وسياسة الاسترجاع الخاصة بنا.'}
                            </p>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
