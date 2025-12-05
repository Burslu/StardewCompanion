'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

interface NPC {
    id: string;
    name: string;
    birthday: string;
    location: string;
    loves: string[];
    likes: string[];
    hates: string[];
    image: string | null;
}

export default function GiftsPage() {
    const [npcs, setNpcs] = useState<NPC[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);

    useEffect(() => {
        fetchNPCs();
    }, []);

    const fetchNPCs = async () => {
        setLoading(true);
        const res = await fetch('/api/npcs');
        const data = await res.json();
        setNpcs(data);
        setLoading(false);
    };

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
                        <Link href="/gifts" className="nav-link active">Gifts</Link>
                        <Link href="/bundles" className="nav-link">Bundles</Link>
                        <Link href="/recipes" className="nav-link">Recipes</Link>
                        <Link href="/mining" className="nav-link">Mining</Link>
                        <Link href="/favorites" className="nav-link">Favorites</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>🎁 NPC Gift Guide</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Find the perfect gift for every villager. Click on a character to see their preferences.
                </p>

                {loading ? (
                    <div className="loading">Loading NPCs...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedNPC ? '1fr 2fr' : '1fr', gap: 'var(--spacing-lg)' }}>
                        {/* NPC List */}
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>Characters</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {npcs.map(npc => (
                                    <div
                                        key={npc.id}
                                        className="card"
                                        onClick={() => setSelectedNPC(npc)}
                                        style={{
                                            padding: 'var(--spacing-sm)',
                                            cursor: 'pointer',
                                            border: selectedNPC?.id === npc.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-sm)'
                                        }}
                                    >
                                        {npc.image && (
                                            <img src={npc.image} alt={npc.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{npc.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                🎂 {npc.birthday}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Gift Details */}
                        {selectedNPC && (
                            <div>
                                <div className="card" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                                        {selectedNPC.image && (
                                            <img src={selectedNPC.image} alt={selectedNPC.name} style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                                        )}
                                        <div>
                                            <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{selectedNPC.name}</h2>
                                            <div style={{ color: 'var(--color-text-muted)' }}>
                                                🎂 Birthday: {selectedNPC.birthday}
                                            </div>
                                            <div style={{ color: 'var(--color-text-muted)' }}>
                                                📍 {selectedNPC.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loves */}
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', color: '#ff6b9d' }}>
                                            ❤️ Loves
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                                            {selectedNPC.loves.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'rgba(255, 107, 157, 0.1)',
                                                        border: '1px solid rgba(255, 107, 157, 0.3)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.875rem',
                                                        color: '#ff6b9d'
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Likes */}
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary-light)' }}>
                                            👍 Likes
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                                            {selectedNPC.likes.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'rgba(45, 159, 93, 0.1)',
                                                        border: '1px solid rgba(45, 159, 93, 0.3)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.875rem',
                                                        color: 'var(--color-primary-light)'
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hates */}
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', color: '#ff6b6b' }}>
                                            💔 Hates
                                        </h3>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                                            {selectedNPC.hates.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        background: 'rgba(255, 107, 107, 0.1)',
                                                        border: '1px solid rgba(255, 107, 107, 0.3)',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        fontSize: '0.875rem',
                                                        color: '#ff6b6b'
                                                    }}
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-elevated)' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)' }}>💡 Gift Tip</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                                        Giving loved gifts increases friendship by 80 points. Giving hated gifts decreases it by 40 points.
                                        Remember birthdays for 8x multiplier!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}
