'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import {
    Users,
    Search,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    DollarSign,
    ChevronRight,
    ArrowUpRight,
    Trash2
} from 'lucide-react';
import styles from './AdminCustomers.module.css';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        setLoading(true);
        const customerMap = {};

        // 1. Fetch from profiles table (registered users)
        try {
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*');

            if (profiles) {
                profiles.forEach(p => {
                    const key = (p.phone || p.id || '').trim();
                    if (key) {
                        customerMap[key] = {
                            name: p.full_name || 'Registered Member',
                            email: '—',
                            phone: p.phone || '—',
                            totalOrders: 0,
                            totalSpent: 0,
                            lastOrder: p.created_at || new Date().toISOString()
                        };
                    }
                });
            }
        } catch (pErr) {
            console.error('Error fetching profiles:', pErr);
        }

        // 2. Fetch from orders table (all orders including pending)
        const { data: orders } = await supabase
            .from('orders')
            .select('customer_name, customer_email, customer_phone, total_amount, created_at, status');

        if (orders) {
            orders.forEach(order => {
                const emailKey = order.customer_email?.trim()?.toLowerCase();
                const phoneKey = order.customer_phone?.trim();
                const key = emailKey || phoneKey;
                if (!key) return;

                // Match existing customer by email or phone
                const existingKey = Object.keys(customerMap).find(k => 
                    (emailKey && customerMap[k].email?.toLowerCase() === emailKey) ||
                    (phoneKey && customerMap[k].phone === phoneKey)
                );

                const targetKey = existingKey || key;

                if (!customerMap[targetKey]) {
                    customerMap[targetKey] = {
                        name: order.customer_name || 'Customer',
                        email: order.customer_email || '—',
                        phone: order.customer_phone || '—',
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrder: order.created_at
                    };
                }

                customerMap[targetKey].totalOrders += 1;
                if (order.status !== 'cancelled') {
                    customerMap[targetKey].totalSpent += parseFloat(order.total_amount || 0);
                }
                if (order.customer_name && (customerMap[targetKey].name === 'Customer' || customerMap[targetKey].name === 'Registered Member')) {
                    customerMap[targetKey].name = order.customer_name;
                }
                if (order.customer_phone && customerMap[targetKey].phone === '—') {
                    customerMap[targetKey].phone = order.customer_phone;
                }
                if (order.customer_email && customerMap[targetKey].email === '—') {
                    customerMap[targetKey].email = order.customer_email;
                }
                if (new Date(order.created_at) > new Date(customerMap[targetKey].lastOrder)) {
                    customerMap[targetKey].lastOrder = order.created_at;
                }
            });
        }

        setCustomers(Object.values(customerMap));
        setLoading(false);
    };

    const handleDeleteCustomer = async (customer) => {
        const confirmMsg = `هل أنت متأكد من حذف العميل "${customer.name || customer.email || customer.phone}"؟\nسيتم حذف جميع الطلبات والبيانات المتعلقة به نهائياً.\n\nAre you sure you want to delete customer "${customer.name || customer.email || customer.phone}"?\nThis will permanently delete all their orders and associated data.`;
        
        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        try {
            // Build the OR query dynamically to avoid errors with null/undefined values
            const conditions = [];
            if (customer.email) conditions.push(`customer_email.eq.${customer.email}`);
            if (customer.phone) conditions.push(`customer_phone.eq.${customer.phone}`);
            
            if (conditions.length === 0) {
                throw new Error('No email or phone available to identify customer.');
            }

            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .or(conditions.join(','));

            if (orderError) throw orderError;

            // Also try to delete profile if it exists (by email or phone matching isn't direct here, but if we have UUID we should use it)
            // For now, since directory is derived from orders, deleting from orders is the main goal.

            alert('تم حذف العميل بنجاح. / Customer deleted successfully.');
            await fetchCustomers();
        } catch (err) {
            console.error('Delete error:', err);
            alert('حدث خطأ أثناء الحذف: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2 className={styles.secTitle}>Customer Directory</h2>
                    <p className={styles.subtitle}>Manage your customer base and lifetime value tracking.</p>
                </div>

                <div className={styles.searchBar}>
                    <Search size={18} color="#C6A75E" />
                    <input
                        placeholder="Search by name, email or phone..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? <div className="gold-text">Syncing customer records...</div> : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Total Orders</th>
                                <th>Lifetime Value</th>
                                <th>Last Order</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className={styles.empty}>No customers found matching your search.</td>
                                </tr>
                            ) : (
                                filteredCustomers.map((c, i) => (
                                    <tr key={i} className={styles.customerRow}>
                                        <td>
                                            <div className={styles.custMain}>
                                                <div className={styles.avatar}>{c.name?.charAt(0)}</div>
                                                <strong>{c.name}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.contactInfo}>
                                                <div className={styles.contactItem}><Mail size={14} /> <span>{c.email || 'N/A'}</span></div>
                                                <div className={styles.contactItem}><Phone size={14} /> <span>{c.phone}</span></div>
                                            </div>
                                        </td>
                                        <td className={styles.center}><span className={styles.badge}>{c.totalOrders}</span></td>
                                        <td className="gold-text"><strong>{c.totalSpent.toFixed(2)} AED</strong></td>
                                        <td className={styles.date}>{new Date(c.lastOrder).toLocaleDateString()}</td>
                                        <td className={styles.actions}>
                                            <button className={styles.viewBtn} title="View Orders">
                                                <ArrowUpRight size={16} />
                                            </button>
                                            <button 
                                                className={styles.deleteBtn} 
                                                title="Delete Customer"
                                                onClick={() => handleDeleteCustomer(c)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
