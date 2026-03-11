'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import {
    Search,
    Filter,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Clock,
    DollarSign
} from 'lucide-react';
import styles from './AdminOrders.module.css';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('active');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        const query = supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    product:products (id, name_en, name_ar, image_url)
                )
            `)
            .order('created_at', { ascending: false });

        if (filter === 'active') {
            query.neq('status', 'pending').neq('status', 'cancelled');
        } else if (filter === 'all') {
            // Still hide pending from 'all' to avoid clutter
            query.neq('status', 'pending');
        } else if (filter === 'abandoned') {
            query.eq('status', 'pending');
        } else {
            query.eq('status', filter);
        }

        const { data, error } = await query;
        if (data) setOrders(data);
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (error) {
            alert('Error updating status: ' + error.message);
        } else {
            fetchOrders();
        }
        setUpdatingId(null);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} color="#ffa500" />;
            case 'processing': return <Package size={16} color="#C6A75E" />;
            case 'shipped': return <Truck size={16} color="#3498db" />;
            case 'delivered': return <CheckCircle size={16} color="#2ecc71" />;
            case 'cancelled': return <XCircle size={16} color="#e74c3c" />;
            default: return null;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2 className={styles.secTitle}>Order Fulfillment</h2>
                    <p className={styles.subtitle}>Manage and track your customer purchases.</p>
                </div>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <Filter size={18} color="#C6A75E" />
                        <select value={filter} onChange={e => setFilter(e.target.value)} className={styles.statusSelect}>
                            <option value="active">Active Orders</option>
                            <option value="all">All (Excl. Abandoned)</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="abandoned">Abandoned Checkouts</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? <div className="gold-text">Fetching latest orders...</div> : (
                <div className={styles.ordersList}>
                    {orders.length === 0 ? <p className={styles.empty}>No orders found.</p> : (
                        orders.map(order => (
                            <div key={order.id} className={`${styles.orderCard} ${expandedOrder === order.id ? styles.expanded : ''}`}>
                                {/* Card Header - Summary View */}
                                <div className={styles.orderSummary} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                                    <div className={styles.mainInfo}>
                                        <div className={styles.orderRef}>
                                            <span className={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</span>
                                            <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className={styles.customerSummary}>
                                            <strong>{order.customer_name}</strong>
                                            <span>{order.customer_phone}</span>
                                        </div>
                                    </div>

                                    <div className={styles.statusInfo}>
                                        <div className={styles.statusBadge} data-status={order.status}>
                                            {getStatusIcon(order.status)}
                                            <span className={styles.statusLabel}>{order.status}</span>
                                        </div>
                                        <div className={styles.orderTotal}>
                                            <span className="gold-text">{parseFloat(order.total_amount).toFixed(2)} AED</span>
                                        </div>
                                        <div className={styles.expandIcon}>
                                            {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order.id && (
                                    <div className={styles.orderDetails}>
                                        <div className={styles.detailsGrid}>
                                            {/* Left: Customer & Shipping */}
                                            <div className={styles.infoColumn}>
                                                <h4>Customer Details</h4>
                                                <div className={styles.infoRow}><UserIcon /> <span>{order.customer_name}</span></div>
                                                <div className={styles.infoRow}><Mail size={16} /> <span style={{wordBreak: 'break-all'}}>{order.customer_email}</span></div>
                                                <div className={styles.infoRow}><Phone size={16} /> <span style={{wordBreak: 'break-all'}}>{order.customer_phone}</span></div>

                                                <h4 style={{ marginTop: '1.5rem' }}>Shipping Address</h4>
                                                <div className={styles.infoRow}><MapPin size={16} /> <span>{order.shipping_address}</span></div>

                                                {order.is_gift && (
                                                    <div className={styles.giftMessage}>
                                                        <div className={styles.giftHeader}><GiftIcon /> <span>Gift Message</span></div>
                                                        <p>&quot;{order.gift_message}&quot;</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Middle: Items List */}
                                            <div className={styles.itemsColumn}>
                                                <h4>Items Ordered</h4>
                                                <div className={styles.itemsTable}>
                                                    {order.order_items.map(item => (
                                                        <div key={item.id} className={styles.itemRow}>
                                                            <div className={styles.itemMain}>
                                                                <Image
                                                                    src={item.product?.image_url || '/product-hero.png'}
                                                                    alt={item.product?.name_en || 'Product'}
                                                                    width={60}
                                                                    height={60}
                                                                    className={styles.itemImg}
                                                                />
                                                                <div>
                                                                    <div className={styles.itemName}>{item.product?.name_en}</div>
                                                                    <div className={styles.itemPrice}>{item.unit_price} AED x {item.quantity}</div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.itemSubtotal}>{(item.unit_price * item.quantity).toFixed(2)} AED</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className={styles.actionsColumn}>
                                                <h4>Update Order Status</h4>
                                                <div className={styles.statusActions}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'processing'); }}
                                                        disabled={updatingId === order.id || order.status === 'processing'}
                                                        className={styles.statusBtn}
                                                        data-status="processing"
                                                    >Process Order</button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'shipped'); }}
                                                        disabled={updatingId === order.id || order.status === 'shipped'}
                                                        className={styles.statusBtn}
                                                        data-status="shipped"
                                                    >Mark Shipped</button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'delivered'); }}
                                                        disabled={updatingId === order.id || order.status === 'delivered'}
                                                        className={styles.statusBtn}
                                                        data-status="delivered"
                                                    >Mark Delivered</button>
                                                    <div className={styles.divider} />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'cancelled'); }}
                                                        disabled={updatingId === order.id || order.status === 'cancelled'}
                                                        className={styles.cancelBtn}
                                                    >Cancel Order</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// Inline helper components
const UserIcon = () => (
    <div style={{ padding: '2px', background: 'rgba(198, 167, 94, 0.1)', borderRadius: '2px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    </div>
);

const GiftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C6A75E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
);
