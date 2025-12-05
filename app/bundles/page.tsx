'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), { ssr: false });

interface Bundle {
    id: string;
    room: string;
    name: string;
    reward: string;
    items: string[];
}

export default function BundlesPage() {
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<string>('All');

    useEffect(() => {
        fetchBundles();
    }, []);

    const fetchBundles = async () => {
        const res = await fetch('/api/bundles');
        const data = await res.json();
        setBundles(data);
        setLoading(false);
    };

    const rooms = ['All', ...Array.from(new Set(bundles.map(b => b.room)))];
    const filteredBundles = selectedRoom === 'All'
        ? bundles
        : bundles.filter(b => b.room === selectedRoom);

    const bundlesByRoom = filteredBundles.reduce((acc, bundle) => {
        if (!acc[bundle.room]) acc[bundle.room] = [];
        acc[bundle.room].push(bundle);
        return acc;
    }, {} as Record<string, Bundle[]>);

    return (
        <>
            <header className="header">
                <div className="container header-content">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div className="logo">🌾 Stardew Companion</div>
                    </Link>
                    <nav className="nav">
                        <Link href="/" className="nav-link">Home</Link>
                        <Link href="/crops" className="nav-link">Crops</Link>
                        <Link href="/fish" className="nav-link">Fish</Link>
                        <Link href="/gifts" className="nav-link">Gifts</Link>
                        <Link href="/bundles" className="nav-link active">Bundles</Link>
                        <Link href="/recipes" className="nav-link">Recipes</Link>
                        <Link href="/mining" className="nav-link">Mining</Link>
                        <Link href="/favorites" className="nav-link">Favorites</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>📦 Community Center Bundles</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Track your progress completing Community Center bundles.
                </p>

                <div className="filter-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    {rooms.map(room => (
                        <button
                            key={room}
                            className="btn"
                            onClick={() => setSelectedRoom(room)}
                            style={{
                                background: selectedRoom === room ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                                color: 'white'
                            }}
                        >
                            {room}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">Loading bundles...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                        {Object.entries(bundlesByRoom).map(([room, roomBundles]) => (
                            <div key={room}>
                                <h2 style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary-light)' }}>
                                    {room}
                                </h2>
                                <div className="grid">
                                    {roomBundles.map(bundle => (
                                        <div key={bundle.id} className="card">
                                            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>
                                                {bundle.name}
                                            </h3>
                                            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                                    Required Items:
                                                </div>
                                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                                    {bundle.items.map((item, idx) => (
                                                        <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div style={{
                                                padding: 'var(--spacing-xs)',
                                                background: 'rgba(45, 159, 93, 0.1)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.875rem',
                                                color: 'var(--color-primary-light)'
                                            }}>
                                                🎁 Reward: {bundle.reward}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
