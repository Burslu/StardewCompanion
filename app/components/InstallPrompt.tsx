'use client';

import { useEffect, useState } from 'react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after 30 seconds
            setTimeout(() => {
                setShowPrompt(true);
            }, 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', 'true');
    };

    if (!showPrompt || !deferredPrompt) return null;

    if (localStorage.getItem('installPromptDismissed')) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--color-bg-elevated)',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            maxWidth: '320px',
            animation: 'slideUp 0.3s ease',
        }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xs)' }}>
                    🌾 Install Stardew Companion
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Install our app for quick access and offline support!
                </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <button
                    onClick={handleInstall}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                >
                    Install
                </button>
                <button
                    onClick={handleDismiss}
                    className="btn"
                    style={{
                        flex: 1,
                        background: 'var(--color-bg-card)',
                        color: 'var(--color-text)'
                    }}
                >
                    Not Now
                </button>
            </div>
        </div>
    );
}
