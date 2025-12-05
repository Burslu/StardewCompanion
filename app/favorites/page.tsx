'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFavorites } from '../contexts/FavoritesContext';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), { ssr: false });

interface Recipe {
    id: string;
    name: string;
    description: string | null;
    ingredients: { item: string; quantity: number }[];
    buffs: { type: string; value: number }[] | null;
    source: string;
}

export default function FavoritesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const { favorites, toggleFavorite } = useFavorites();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/recipes');
            const data = await res.json();
            setRecipes(data);
        } catch (error) {
            console.error('Failed to fetch recipes', error);
        } finally {
            setLoading(false);
        }
    };

    const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

    const getCategoryColor = (category: string | null) => {
        const colors: Record<string, string> = {
            'Breakfast': '#FFB84D',
            'Lunch': '#4ECDC4',
            'Dinner': '#FF6B6B',
            'Dessert': '#FF69B4',
            'Soup': '#95E1D3',
            'Salad': '#A8E6CF',
            'Appetizer': '#FDCB6E',
            'Bread': '#D4A574',
        };
        return colors[category || ''] || '#9B59B6';
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
                        <Link href="/mining" className="nav-link">Mining</Link>
                        <Link href="/favorites" className="nav-link active">Favorites</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>⭐ My Favorites</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Your favorite recipes in one place. Click the heart to remove from favorites.
                </p>

                {loading ? (
                    <div className="loading">Loading favorites...</div>
                ) : favoriteRecipes.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        background: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px dashed var(--color-border)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🤍</div>
                        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>No favorites yet!</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
                            Go to the Recipes page and click the heart icon to add your favorite recipes.
                        </p>
                        <Link href="/recipes" className="btn btn-primary">
                            Browse Recipes
                        </Link>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>
                            {favoriteRecipes.length} favorite {favoriteRecipes.length === 1 ? 'recipe' : 'recipes'}
                        </div>
                        <div className="grid">
                            {favoriteRecipes.map(recipe => (
                                <div key={recipe.id} className="card" style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => toggleFavorite(recipe.id)}
                                        style={{
                                            position: 'absolute',
                                            top: 'var(--spacing-sm)',
                                            right: 'var(--spacing-sm)',
                                            background: 'var(--color-bg-elevated)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: '50%',
                                            width: '36px',
                                            height: '36px',
                                            cursor: 'pointer',
                                            fontSize: '1.25rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all var(--transition-base)',
                                        }}
                                        aria-label="Remove from favorites"
                                    >
                                        ❤️
                                    </button>

                                    <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-sm)', paddingRight: '2.5rem' }}>
                                        {recipe.name}
                                    </h3>

                                    {recipe.description && (
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'white',
                                            background: getCategoryColor(recipe.description),
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            display: 'inline-block',
                                            marginBottom: 'var(--spacing-sm)',
                                            textTransform: 'uppercase',
                                            fontWeight: 600
                                        }}>
                                            {recipe.description}
                                        </div>
                                    )}

                                    <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                                            📦 Ingredients:
                                        </div>
                                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem' }}>
                                            {recipe.ingredients.map((ing, idx) => (
                                                <li key={idx} style={{ marginBottom: '0.25rem' }}>
                                                    {ing.item} x{ing.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {recipe.buffs && recipe.buffs.length > 0 && (
                                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                                                ✨ Buffs:
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                                                {recipe.buffs.map((buff, idx) => (
                                                    <span
                                                        key={idx}
                                                        style={{
                                                            background: 'rgba(45, 159, 93, 0.1)',
                                                            border: '1px solid rgba(45, 159, 93, 0.3)',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: 'var(--radius-sm)',
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-primary-light)'
                                                        }}
                                                    >
                                                        {buff.type} +{buff.value}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{
                                        padding: 'var(--spacing-xs)',
                                        background: 'var(--color-bg-elevated)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.75rem',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        📚 Source: {recipe.source}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </>
    );
}
