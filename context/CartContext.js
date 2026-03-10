'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart and coupon from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('al-dalal-cart');
        const savedCoupon = localStorage.getItem('al-dalal-coupon');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        if (savedCoupon) {
            try {
                setAppliedCoupon(JSON.parse(savedCoupon));
            } catch (e) {
                console.error("Failed to parse coupon", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart and coupon to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('al-dalal-cart', JSON.stringify(cart));
            if (appliedCoupon) {
                localStorage.setItem('al-dalal-coupon', JSON.stringify(appliedCoupon));
            } else {
                localStorage.removeItem('al-dalal-coupon');
            }
        }
    }, [cart, appliedCoupon, isLoaded]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCart([]);
        setAppliedCoupon(null);
    };

    const applyCoupon = async (code) => {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('active', true)
            .single();

        if (error || !data) {
            return { success: false, message: 'Invalid or inactive coupon' };
        }

        // Check expiry
        if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
            return { success: false, message: 'Coupon has expired' };
        }

        // Check min order
        if (cartTotal < data.min_order_value) {
            return { success: false, message: `Minimum order of ${data.min_order_value} AED required` };
        }

        setAppliedCoupon(data);
        return { success: true, message: 'Coupon applied successfully!' };
    };

    const removeCoupon = () => setAppliedCoupon(null);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => {
        const priceVal = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : item.price;
        return total + (priceVal || 0) * item.quantity;
    }, 0);

    // Automatic Discount Logic: 10% off for 3+ items
    let discountPercent = 0;
    if (cartCount >= 3) {
        discountPercent = 0.10; // 10% discount
    }

    const cartDiscount = cartTotal * discountPercent;

    // Coupon Discount Logic
    let couponDiscount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discount_type === 'percentage') {
            couponDiscount = (cartTotal - cartDiscount) * (appliedCoupon.discount_value / 100);
        } else {
            couponDiscount = Math.min(appliedCoupon.discount_value, cartTotal - cartDiscount);
        }
    }

    const finalTotal = cartTotal - cartDiscount - couponDiscount;

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            cartDiscount,
            couponDiscount,
            appliedCoupon,
            applyCoupon,
            removeCoupon,
            finalTotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
