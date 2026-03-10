'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Home,
    Tag
} from 'lucide-react';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const allowedAdmins = ['aldalalbakhour@gmail.com', 'monzerhafiz83@gmail.com'];

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session || !allowedAdmins.includes(session.user.email)) {
                router.push('/login');
                return;
            }
            setUser(session.user);
            setLoading(false);
        };
        checkAdmin();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className={styles.adminLayout} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="gold-text">Verifying Admin Access...</div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Coupons', path: '/admin/coupons', icon: <Tag size={20} /> },
        { name: 'Customers', path: '/admin/customers', icon: <Users size={20} /> },
        { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <span className={styles.logoText}>Al Dalal Admin</span>
                    <Link href="/" className={styles.navLink} style={{ paddingLeft: 0, marginTop: '1rem' }}>
                        <Home size={16} /> <span>View Website</span>
                    </Link>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.activeLink : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ padding: '2rem' }}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={16} /> <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.topBar}>
                    <h1 className={styles.pageTitle}>
                        {navItems.find(i => i.path === pathname)?.name || 'Admin'}
                    </h1>
                    <div className={styles.adminUser}>
                        <span>{user.email}</span>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#44ff44' }} />
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
