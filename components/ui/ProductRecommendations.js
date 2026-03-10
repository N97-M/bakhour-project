'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { translations } from '@/utils/translations';
import { Plus } from 'lucide-react';
import styles from './ProductRecommendations.module.css';

export default function ProductRecommendations() {
    const { lang } = useLanguage();
    const { addToCart } = useCart();

    // In a real generic app, 'products' would be fetched from the database based on the cart's contents.
    // For now, we mock recommendations (IDs: 4, 7, 5) which are Signature and Sandalwood items.
    const allProducts = translations[lang].products;
    const recommendations = allProducts.filter(p => [4, 7, 5].includes(p.id));

    return (
        <section className={styles.recommendations}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {lang === 'en' ? 'You May Also Like' : 'قد يعجبك أيضاً'}
                    </h2>
                    <span className="gold-divider" />
                </div>

                <div className={styles.grid}>
                    {recommendations.map(product => (
                        <div key={product.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <span className={styles.category}>{product.category}</span>
                                <h3 className={styles.name}>{product.name}</h3>
                                <p className={styles.notes}>{product.notes}</p>
                                <div className={styles.bottom}>
                                    <span className={styles.price}>{product.price}</span>
                                    <button
                                        className={styles.addBtn}
                                        onClick={() => addToCart(product)}
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
