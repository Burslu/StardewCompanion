'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

interface Section {
    name: string;
    floors: string;
    theme: string;
    monsters: string[];
    ores: string[];
    gems: string[];
    geodes: string[];
    notes: string;
}

interface MiningLocation {
    id: string;
    location: string;
    description: string;
    floors: string;
    sections: Section[];
}

export default function MiningPage() {
    const [locations, setLocations] = useState<MiningLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<string>('The Mines');

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        setLoading(true);
        const res = await fetch('/api/mining');
        const data = await res.json();
        setLocations(data);
        setLoading(false);
    };

    const currentLocation = locations.find(loc => loc.location === selectedLocation);

    const getThemeColor = (theme: string) => {
        if (theme.includes('earth')) return '#8B4513';
        if (theme.includes('Ice') || theme.includes('snow')) return '#4A90E2';
        if (theme.includes('Lava') || theme.includes('purple')) return '#FF6B35';
        if (theme.includes('Desert')) return '#F4A460';
        return 'var(--color-primary)';
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
                        <Link href="/gifts" className="nav-link">Gifts</Link>
                        <Link href="/bundles" className="nav-link">Bundles</Link>
                        <Link href="/recipes" className="nav-link">Recipes</Link>
                        <Link href="/mining" className="nav-link active">Mining</Link>
                        <Link href="/favorites" className="nav-link">Favorites</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>⛏️ Mining Guides</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Complete guide to mining locations, floors, monsters, ores, and gems.
                </p>

                {loading ? (
                    <div className="loading">Loading mining locations...</div>
                ) : (
                    <>
                        {/* Location Selector */}
                        <div className="filter-bar" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {locations.map(location => (
                                <button
                                    key={location.id}
                                    className="btn"
                                    onClick={() => setSelectedLocation(location.location)}
                                    style={{
                                        background: selectedLocation === location.location ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                                        color: 'white'
                                    }}
                                >
                                    {location.location}
                                </button>
                            ))}
                        </div>

                        {/* Location Details */}
                        {currentLocation && (
                            <div>
                                <div className="card" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                                        {currentLocation.location}
                                    </h2>
                                    <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                                        {currentLocation.description}
                                    </p>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                        background: 'rgba(45, 159, 93, 0.1)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        color: 'var(--color-primary-light)',
                                        fontWeight: 600
                                    }}>
                                        📊 Floors: {currentLocation.floors}
                                    </div>
                                </div>

                                {/* Sections */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                    {currentLocation.sections.map((section, idx) => (
                                        <div key={idx} className="card" style={{ padding: 'var(--spacing-lg)' }}>
                                            <div style={{
                                                borderLeft: `4px solid ${getThemeColor(section.theme)}`,
                                                paddingLeft: 'var(--spacing-md)',
                                                marginBottom: 'var(--spacing-md)'
                                            }}>
                                                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>
                                                    {section.name}
                                                </h3>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                    Floors: {section.floors} • Theme: {section.theme}
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
                                                {/* Monsters */}
                                                {section.monsters.length > 0 && (
                                                    <div>
                                                        <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)', color: '#ff6b6b' }}>
                                                            👹 Monsters
                                                        </h4>
                                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                                            {section.monsters.map((monster, i) => (
                                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{monster}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Ores */}
                                                {section.ores.length > 0 && (
                                                    <div>
                                                        <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)', color: '#a0522d' }}>
                                                            ⛏️ Ores
                                                        </h4>
                                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                                            {section.ores.map((ore, i) => (
                                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{ore}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Gems */}
                                                {section.gems.length > 0 && (
                                                    <div>
                                                        <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)', color: '#9b59b6' }}>
                                                            💎 Gems
                                                        </h4>
                                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                                            {section.gems.map((gem, i) => (
                                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{gem}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Geodes */}
                                                {section.geodes.length > 0 && (
                                                    <div>
                                                        <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)', color: '#3498db' }}>
                                                            🪨 Geodes
                                                        </h4>
                                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                                            {section.geodes.map((geode, i) => (
                                                                <li key={i} style={{ marginBottom: '0.25rem' }}>{geode}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Notes */}
                                            {section.notes && (
                                                <div style={{
                                                    marginTop: 'var(--spacing-md)',
                                                    padding: 'var(--spacing-sm)',
                                                    background: 'rgba(45, 159, 93, 0.1)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    borderLeft: '3px solid var(--color-primary)'
                                                }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                                                        💡 Tips
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                                                        {section.notes}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    );
}
