'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), { ssr: false });

interface Crop {
    id: string;
    name: string;
    description: string | null;
    season: string;
    growthTime: number;
    regrowthTime: number | null;
    sellPrice: number | null;
    seedPrice: number | null;
    image: string | null;
}

export default function CropsPage() {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<string>('');

    useEffect(() => {
        fetchCrops();
    }, [selectedSeason]);

    const fetchCrops = async () => {
        setLoading(true);
        const url = selectedSeason
            ? `/api/crops?season=${selectedSeason}`
            : '/api/crops';

        const res = await fetch(url);
        const data = await res.json();
        setCrops(data);
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
                        <Link href="/crops" className="nav-link active">Crops</Link>
                        <Link href="/fish" className="nav-link">Fish</Link>
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
                <h1>🌱 Crops</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Browse all crops and filter by season to find the best options for your farm.
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
                    <div className="loading">Loading crops...</div>
                ) : (
                    <div className="grid">
                        {crops.map(crop => (
                            <div key={crop.id} className="card">
                                {crop.image && (
                                    <img src={crop.image} alt={crop.name} className="item-image" />
                                )}
                                <div className="item-name">{crop.name}</div>
                                <div className="item-description">{crop.description}</div>
                                <div className="item-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">Season:</span>
                                        <span className="meta-value">{crop.season}</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Growth Time:</span>
                                        <span className="meta-value">{crop.growthTime} days</span>
                                    </div>
                                    {crop.regrowthTime && (
                                        <div className="meta-row">
                                            <span className="meta-label">Regrowth:</span>
                                            <span className="meta-value">{crop.regrowthTime} days</span>
                                        </div>
                                    )}
                                    <div className="meta-row">
                                        <span className="meta-label">Sell Price:</span>
                                        <span className="meta-value">{crop.sellPrice}g</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Seed Price:</span>
                                        <span className="meta-value">{crop.seedPrice}g</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
