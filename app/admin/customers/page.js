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
        // We derive customers from the orders table
        const { data, error } = await supabase
            .from('orders')
            .select('customer_name, customer_email, customer_phone, total_amount, created_at')
            .neq('status', 'pending');

        if (data) {
            // Group by email/phone to find unique customers
            const customerMap = {};
            data.forEach(order => {
                const key = order.customer_email || order.customer_phone;
                if (!customerMap[key]) {
                    customerMap[key] = {
                        name: order.customer_name,
                        email: order.customer_email,
                        phone: order.customer_phone,
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrder: order.created_at
                    };
                }
                customerMap[key].totalOrders += 1;
                customerMap[key].totalSpent += parseFloat(order.total_amount);
                if (new Date(order.created_at) > new Date(customerMap[key].lastOrder)) {
                    customerMap[key].lastOrder = order.created_at;
                }
            });
            setCustomers(Object.values(customerMap));
        }
        setLoading(false);
    };

    const handleDeleteCustomer = async (customer) => {
        const confirmMsg = `هل أنت متأكد من حذف العميل "${customer.name || customer.email}"؟ سيتم حذف جميع الطلبات والبيانات المتعلقة به.\n\nAre you sure you want to delete customer "${customer.name || customer.email}"? This will delete all their orders and associated data.`;
        
        if (!window.confirm(confirmMsg)) return;

        setLoading(true);
        try {
            // 1. Delete orders matching email OR phone
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .or(`customer_email.eq.${customer.email},customer_phone.eq.${customer.phone}`);

            if (orderError) throw orderError;

            // 2. Refresh list
            alert('تم حذف العميل بنجاح. / Customer deleted successfully.');
            fetchCustomers();
        } catch (err) {
            alert('حدث خطأ أثناء الحذف: ' + err.message);
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
