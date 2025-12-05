'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    name: string;
    type: 'recipe' | 'fish' | 'crop';
    category?: string;
}

export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setLoading(true);
            try {
                const [recipes, fish, crops] = await Promise.all([
                    fetch('/api/recipes').then(r => r.json()),
                    fetch('/api/fish').then(r => r.json()),
                    fetch('/api/crops').then(r => r.json()),
                ]);

                const allResults: SearchResult[] = [
                    ...recipes
                        .filter((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .slice(0, 5)
                        .map((r: any) => ({ id: r.id, name: r.name, type: 'recipe' as const, category: r.description })),
                    ...fish
                        .filter((f: any) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .slice(0, 5)
                        .map((f: any) => ({ id: f.id, name: f.name, type: 'fish' as const })),
                    ...crops
                        .filter((c: any) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .slice(0, 5)
                        .map((c: any) => ({ id: c.id, name: c.name, type: 'crop' as const })),
                ];

                setResults(allResults);
            } catch (error) {
                console.error('Search error:', error);
            }
            setLoading(false);
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const handleResultClick = (result: SearchResult) => {
        if (result.type === 'recipe') router.push('/recipes');
        if (result.type === 'fish') router.push('/fish');
        if (result.type === 'crop') router.push('/crops');
        setIsOpen(false);
        setSearchTerm('');
    };

    const getTypeIcon = (type: string) => {
        if (type === 'recipe') return '🍳';
        if (type === 'fish') return '🐟';
        if (type === 'crop') return '🌱';
        return '📦';
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    transition: 'all var(--transition-base)',
                }}
            >
                🔍 Search
                <kbd style={{
                    background: 'var(--color-bg-card)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    border: '1px solid var(--color-border)',
                }}>
                    Ctrl+K
                </kbd>
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setIsOpen(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Search Modal */}
            <div style={{
                position: 'fixed',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '600px',
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1001,
                border: '1px solid var(--color-border)',
            }}>
                <input
                    type="text"
                    placeholder="Search recipes, fish, crops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.125rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        outline: 'none',
                    }}
                />

                <div style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                }}>
                    {loading && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            Searching...
                        </div>
                    )}

                    {!loading && results.length === 0 && searchTerm.length >= 2 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No results found
                        </div>
                    )}

                    {!loading && results.map((result) => (
                        <div
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-base)',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-card)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <span style={{ fontSize: '1.5rem' }}>{getTypeIcon(result.type)}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{result.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                                    {result.type} {result.category && `• ${result.category}`}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    padding: '0.75rem 1rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                }}>
                    <span>Press ESC to close</span>
                    <span>Ctrl+K to open</span>
                </div>
            </div>
        </>
    );
}
