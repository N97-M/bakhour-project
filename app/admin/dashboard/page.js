'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import {
    TrendingUp,
    ShoppingBag,
    AlertCircle,
    Clock,
    DollarSign,
    ShoppingCart,
    Package,
    Truck
} from 'lucide-react';
import styles from '../AdminDashboard.module.css';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalSales: 0,
        activeOrders: 0,
        lowStock: 0,
        pendingShipment: 0, // Added for new stat
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // 1. Fetch Real Low Stock
                const { data: lowStockItems } = await supabase.from('products').select('*').lt('stock_quantity', 5);

                // 2. Fetch Active Orders (not delivered/cancelled)
                const { count: activeOrdersCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .not('status', 'in', '("delivered","cancelled")');

                // 3. Fetch Pending Shipment
                const { count: pendingShipmentCount } = await supabase
                    .from('orders')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'processing');

                // 4. Calculate Total Revenue (Real)
                const { data: orders } = await supabase
                    .from('orders')
                    .select('total_amount')
                    .eq('status', 'delivered');

                const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;

                // 5. Fetch Recent Activity (Real)
                const { data: recentOrders } = await supabase
                    .from('orders')
                    .select('id, customer_name, created_at') // Added id to select
                    .order('created_at', { ascending: false })
                    .limit(3);

                setStats({
                    totalSales: totalRevenue,
                    activeOrders: activeOrdersCount || 0,
                    lowStock: lowStockItems?.length || 0,
                    pendingShipment: pendingShipmentCount || 0,
                    recentActivity: recentOrders?.map(o => ({
                        id: o.id,
                        type: 'order',
                        text: `New order from ${o.customer_name}`,
                        time: new Date(o.created_at).toLocaleTimeString()
                    })) || []
                });
            } catch (err) {
                console.error("Dashboard error:", err);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="gold-text">Loading insights...</div>;

    const cards = [
        { title: 'Total Revenue', value: `${stats.totalSales.toFixed(2)} AED`, icon: <DollarSign />, color: '#C6A75E' },
        { title: 'Active Orders', value: stats.activeOrders, icon: <ShoppingCart />, color: '#3498db' },
        { title: 'Low Stock Items', value: stats.lowStock, icon: <Package />, color: '#e74c3c' },
        { title: 'Pending Shipment', value: stats.pendingShipment, icon: <Truck />, color: '#2ecc71' },
    ];

    return (
        <div className={styles.dashboard}>
            <div className={styles.statsGrid}>
                {cards.map((card, idx) => (
                    <div key={idx} className={styles.statCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>{card.title}</span>
                            <div style={{ color: card.color }}>{card.icon}</div>
                        </div>
                        <div className={styles.cardValue}>{card.value}</div>
                    </div>
                ))}
            </div>

            <div className={styles.recentGrid}>
                <div className={styles.recentBox}>
                    <h3 className={styles.boxTitle}>Recent Activity</h3>
                    <div className={styles.activityList}>
                        {stats.recentActivity.map(item => (
                            <div key={item.id} className={styles.activityItem}>
                                <p>{item.text}</p>
                                <span>{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.recentBox}>
                    <h3 className={styles.boxTitle}>Quick Actions</h3>
                    <div className={styles.actionGrid}>
                        <a href="/admin/products" className={styles.actionBtn}>Add New Product</a>
                        <a href="/admin/coupons" className={styles.actionBtn}>Create Coupon</a>
                        <a href="/admin/settings" className={styles.actionBtn}>Update Website Banner</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
