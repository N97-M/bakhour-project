'use client';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
    const { lang } = useLanguage();
    const t = translations[lang].cart;

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <section className={`${styles.cartSection} section-padding`}>
                    <div className="container">
                        <header className={styles.header}>
                            <h1 className={styles.title}>{t.title} <span className="gold-text">{t.goldTitle}</span></h1>
                            <p className={styles.subtitle}>{cartCount} {t.itemsCount}</p>
                            <span className="gold-divider" />
                        </header>

                        {cart.length === 0 ? (
                            <div className={styles.empty}>
                                <ShoppingBag size={64} strokeWidth={1} className={styles.emptyIcon} />
                                <p>{t.empty}</p>
                                <Link href="/gallery" className="btn-luxury">
                                    <span>{t.browse}</span>
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {/* Items List */}
                                <div className={styles.itemsList}>
                                    {cart.map((item) => (
                                        <div key={item.id} className={styles.item}>
                                            <div className={styles.itemInfo}>
                                                <h3 className={styles.itemName}>{item.name}</h3>
                                                <p className={styles.itemCategory}>{item.category}</p>
                                            </div>

                                            <div className={styles.itemActions}>
                                                <div className={styles.quantity}>
                                                    <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                                                        <Minus size={16} />
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <div className={styles.itemPrice}>
                                                    {(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)} AED
                                                </div>

                                                <button
                                                    className={styles.removeBtn}
                                                    onClick={() => removeFromCart(item.id)}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Sidebar */}
                                <aside className={styles.summary}>
                                    <div className={styles.summaryCard}>
                                        <h2 className={styles.summaryTitle}>{t.summary}</h2>
                                        <div className={styles.summaryDetail}>
                                            <span>{t.subtotal}</span>
                                            <span>{cartTotal.toFixed(2)} AED</span>
                                        </div>
                                        <div className={styles.summaryDetail}>
                                            <span>{t.shipping}</span>
                                            <span className={styles.complimentary}>{t.complimentary}</span>
                                        </div>
                                        <div className={styles.summaryTotal}>
                                            <span>{t.total}</span>
                                            <span className="gold-text">{cartTotal.toFixed(2)} AED</span>
                                        </div>

                                        <button className={`${styles.checkoutBtn} btn-luxury w-100`}>
                                            <span>{t.checkout}</span>
                                            <ArrowRight size={18} />
                                        </button>

                                        <p className={styles.secureText}>
                                            {t.secure}
                                        </p>
                                    </div>
                                    <Link href="/gallery" className={styles.continueLink}>
                                        {lang === 'en' ? '← Continue Shopping' : '← متابعة التسوق'}
                                    </Link>
                                </aside>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
