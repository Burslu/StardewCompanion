'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), { ssr: false });

interface Fish {
    id: string;
    name: string;
    description: string | null;
    season: string;
    weather: string;
    location: string;
    time: string | null;
    difficulty: number | null;
    image: string | null;
}

export default function FishPage() {
    const [fish, setFish] = useState<Fish[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<string>('');

    useEffect(() => {
        fetchFish();
    }, [selectedSeason]);

    const fetchFish = async () => {
        setLoading(true);
        const url = selectedSeason
            ? `/api/fish?season=${selectedSeason}`
            : '/api/fish';

        const res = await fetch(url);
        const data = await res.json();
        setFish(data);
        setLoading(false);
    };

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

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
                        <Link href="/fish" className="nav-link active">Fish</Link>
                        <Link href="/gifts" className="nav-link">Gifts</Link>
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
                <h1>🐟 Fish</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Discover where and when to catch every fish in Stardew Valley.
                </p>

                <div className="filter-bar">
                    <button
                        className={`btn ${!selectedSeason ? 'btn-primary' : ''}`}
                        onClick={() => setSelectedSeason('')}
                        style={{ background: !selectedSeason ? 'var(--color-primary)' : 'var(--color-bg-elevated)', color: 'white' }}
                    >
                        All Seasons
                    </button>
                    {seasons.map(season => (
                        <button
                            key={season}
                            className={`btn ${selectedSeason === season ? 'btn-primary' : ''}`}
                            onClick={() => setSelectedSeason(season)}
                            style={{ background: selectedSeason === season ? 'var(--color-primary)' : 'var(--color-bg-elevated)', color: 'white' }}
                        >
                            {season}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading">Loading fish...</div>
                ) : (
                    <div className="grid">
                        {fish.map(f => (
                            <div key={f.id} className="card">
                                {f.image && (
                                    <img src={f.image} alt={f.name} className="item-image" />
                                )}
                                <div className="item-name">{f.name}</div>
                                <div className="item-description">{f.description}</div>
                                <div className="item-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">Season:</span>
                                        <span className="meta-value">{f.season}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Location:</span>
                                        <span className="meta-value">{f.location}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Weather:</span>
                                        <span className="meta-value">{f.weather}</span>
                                    </div>
                                    {f.time && (
                                        <div className="meta-row">
                                            <span className="meta-label">Time:</span>
                                            <span className="meta-value">{f.time}</span>
                                        </div>
                                    )}
                                    {f.difficulty && (
                                        <div className="meta-row">
                                            <span className="meta-label">Difficulty:</span>
                                            <span className="meta-value">{f.difficulty}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
