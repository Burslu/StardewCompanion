'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Crop {
    id: string;
    name: string;
    season: string;
    growthTime: number;
    regrowthTime: number | null;
    sellPrice: number | null;
    seedPrice: number | null;
    image: string | null;
}

interface PlannedCrop {
    crop: Crop;
    quantity: number;
}

export default function PlannerPage() {
    const [crops, setCrops] = useState<Crop[]>([]);
    const [plannedCrops, setPlannedCrops] = useState<PlannedCrop[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<string>('Spring');

    useEffect(() => {
        fetchCrops();
    }, [selectedSeason]);

    const fetchCrops = async () => {
        const url = `/api/crops?season=${selectedSeason}`;
        const res = await fetch(url);
        const data = await res.json();
        setCrops(data);
    };

    const addCrop = (crop: Crop) => {
        const existing = plannedCrops.find(pc => pc.crop.id === crop.id);
        if (existing) {
            setPlannedCrops(plannedCrops.map(pc =>
                pc.crop.id === crop.id ? { ...pc, quantity: pc.quantity + 1 } : pc
            ));
        } else {
            setPlannedCrops([...plannedCrops, { crop, quantity: 1 }]);
        }
    };

    const removeCrop = (cropId: string) => {
        setPlannedCrops(plannedCrops.filter(pc => pc.crop.id !== cropId));
    };

    const updateQuantity = (cropId: string, quantity: number) => {
        if (quantity <= 0) {
            removeCrop(cropId);
        } else {
            setPlannedCrops(plannedCrops.map(pc =>
                pc.crop.id === cropId ? { ...pc, quantity } : pc
            ));
        }
    };

    const calculateProfit = (pc: PlannedCrop) => {
        const { crop, quantity } = pc;
        const seedCost = (crop.seedPrice || 0) * quantity;
        const revenue = (crop.sellPrice || 0) * quantity;
        return revenue - seedCost;
    };

    const totalProfit = plannedCrops.reduce((sum, pc) => sum + calculateProfit(pc), 0);
    const totalInvestment = plannedCrops.reduce((sum, pc) => sum + ((pc.crop.seedPrice || 0) * pc.quantity), 0);

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

    return (
        <>
            <header className="header">
                <div className="container header-content">
                    <div className="logo">🌾 Stardew Companion</div>
                    <nav className="nav">
                        <Link href="/" className="nav-link">Home</Link>
                        <Link href="/crops" className="nav-link">Crops</Link>
                        <Link href="/fish" className="nav-link">Fish</Link>
                        <Link href="/planner" className="nav-link active">Planner</Link>
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>📋 Crop Planner</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Plan your crops and calculate potential profits for the season.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                    {/* Available Crops */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>Available Crops</h2>

                        <div className="filter-bar" style={{ marginBottom: 'var(--spacing-md)' }}>
                            {seasons.map(season => (
                                <button
                                    key={season}
                                    className={`btn ${selectedSeason === season ? 'btn-primary' : ''}`}
                                    onClick={() => setSelectedSeason(season)}
                                    style={{
                                        background: selectedSeason === season ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                                        color: 'white',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {season}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {crops.map(crop => (
                                <div key={crop.id} className="card" style={{ padding: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        {crop.image && <img src={crop.image} alt={crop.name} style={{ width: '32px', height: '32px' }} />}
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{crop.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                {crop.sellPrice}g | {crop.growthTime}d
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => addCrop(crop)}
                                        style={{ padding: 'var(--spacing-xs)', fontSize: '0.875rem' }}
                                    >
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Planned Crops */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-md)' }}>Your Plan</h2>

                        {plannedCrops.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                                No crops planned yet. Add crops from the left!
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                                    {plannedCrops.map(pc => (
                                        <div key={pc.crop.id} className="card" style={{ padding: 'var(--spacing-sm)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xs)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                    {pc.crop.image && <img src={pc.crop.image} alt={pc.crop.name} style={{ width: '32px', height: '32px' }} />}
                                                    <div style={{ fontWeight: 600 }}>{pc.crop.name}</div>
                                                </div>
                                                <button
                                                    onClick={() => removeCrop(pc.crop.id)}
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', alignItems: 'center' }}>
                                                    <button
                                                        onClick={() => updateQuantity(pc.crop.id, pc.quantity - 1)}
                                                        className="btn"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: 'var(--color-bg-elevated)', color: 'white' }}
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={pc.quantity}
                                                        onChange={(e) => updateQuantity(pc.crop.id, parseInt(e.target.value) || 0)}
                                                        className="input"
                                                        style={{ width: '60px', textAlign: 'center', padding: '0.25rem' }}
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(pc.crop.id, pc.quantity + 1)}
                                                        className="btn"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', background: 'var(--color-bg-elevated)', color: 'white' }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    <span style={{ color: 'var(--color-text-muted)' }}>Profit: </span>
                                                    <span style={{ color: calculateProfit(pc) >= 0 ? 'var(--color-primary-light)' : '#ff6b6b', fontWeight: 600 }}>
                                                        {calculateProfit(pc)}g
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: 'var(--spacing-md)' }}>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--spacing-sm)' }}>Summary</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Total Investment:</span>
                                            <span style={{ fontWeight: 600 }}>{totalInvestment}g</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Total Revenue:</span>
                                            <span style={{ fontWeight: 600 }}>{totalInvestment + totalProfit}g</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--spacing-xs)', borderTop: '1px solid var(--color-border)' }}>
                                            <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>Net Profit:</span>
                                            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: totalProfit >= 0 ? 'var(--color-primary-light)' : '#ff6b6b' }}>
                                                {totalProfit}g
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
