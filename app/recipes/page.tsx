'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { useFavorites } from '../contexts/FavoritesContext';

interface Ingredient {
    item: string;
    quantity: number;
}

interface Buff {
    type: string;
    value: number;
}

interface Recipe {
    id: string;
    name: string;
    description: string | null;
    ingredients: Ingredient[];
    buffs: Buff[] | null;
    source: string;
    image: string | null;
    energy?: number;
    health?: number;
    sellPrice?: number;
}

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        const res = await fetch('/api/recipes');
        const data = await res.json();
        setRecipes(data);
        setLoading(false);
    };

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(recipes.map(r => r.description).filter(Boolean)))];

    // Filter recipes
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || recipe.description === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                        <Link href="/recipes" className="nav-link active">Recipes</Link>
                        <Link href="/mining" className="nav-link">Mining</Link>
                        <Link href="/favorites" className="nav-link">Favorites</Link>
                        <Link href="/planner" className="nav-link">Planner</Link>
                        <ThemeToggle />
                    </nav>
                </div>
            </header>

            <main className="container" style={{ paddingTop: '2rem' }}>
                <h1>🍳 Cooking Recipes</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                    Discover all cooking recipes, their ingredients, and special buffs.
                </p>

                {/* Search and Filter */}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-sm)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-elevated)',
                            color: 'var(--color-text)',
                            fontSize: '1rem',
                            marginBottom: 'var(--spacing-md)'
                        }}
                    />

                    <div className="filter-bar">
                        {categories.map(category => (
                            <button
                                key={category}
                                className="btn"
                                onClick={() => setSelectedCategory(category as string)}
                                style={{
                                    background: selectedCategory === category ? 'var(--color-primary)' : 'var(--color-bg-elevated)',
                                    color: 'white'
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading recipes...</div>
                ) : (
                    <>
                        <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-text-muted)' }}>
                            Showing {filteredRecipes.length} of {recipes.length} recipes
                        </div>
                        <div className="grid">
                            {filteredRecipes.map(recipe => (
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
                                        aria-label="Toggle favorite"
                                    >
                                        {isFavorite(recipe.id) ? '❤️' : '🤍'}
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

                                    {/* Ingredients */}
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

                                    {/* Buffs */}
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

                                    {/* Source */}
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
