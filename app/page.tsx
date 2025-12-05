'use client';

import Link from 'next/link';
import './globals.css';
import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('./components/ThemeToggle'), { ssr: false });
const GlobalSearch = dynamic(() => import('./components/GlobalSearch'), { ssr: false });
const InstallPrompt = dynamic(() => import('./components/InstallPrompt'), { ssr: false });

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="logo">🌾 Stardew Companion</div>
          </Link>
          <nav className="nav">
            <Link href="/" className="nav-link active">Home</Link>
            <Link href="/crops" className="nav-link">Crops</Link>
            <Link href="/fish" className="nav-link">Fish</Link>
            <Link href="/gifts" className="nav-link">Gifts</Link>
            <Link href="/bundles" className="nav-link">Bundles</Link>
            <Link href="/recipes" className="nav-link">Recipes</Link>
            <Link href="/mining" className="nav-link">Mining</Link>
            <Link href="/favorites" className="nav-link">Favorites</Link>
            <Link href="/planner" className="nav-link">Planner</Link>
            <GlobalSearch />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1 className="hero-title">Stardew Valley Companion</h1>
          <p className="hero-subtitle">
            Your ultimate guide to crops, fish, and more. Plan your farm, discover the best strategies, and maximize your profits!
          </p>
        </section>

        <div className="grid">
          <Link href="/crops" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>🌱 Crops</h3>
              <p className="item-description">
                Browse all crops, filter by season, and find the most profitable options for your farm.
              </p>
            </div>
          </Link>

          <Link href="/fish" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>🐟 Fish</h3>
              <p className="item-description">
                Discover where and when to catch every fish in Stardew Valley.
              </p>
            </div>
          </Link>

          <Link href="/gifts" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>🎁 Gifts</h3>
              <p className="item-description">
                Find the perfect gift for every villager. See what they love, like, and hate.
              </p>
            </div>
          </Link>

          <Link href="/bundles" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>📦 Bundles</h3>
              <p className="item-description">
                Track Community Center bundles and see what items you need.
              </p>
            </div>
          </Link>

          <Link href="/recipes" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>🍳 Recipes</h3>
              <p className="item-description">
                Discover all cooking recipes, ingredients, and special buffs.
              </p>
            </div>
          </Link>

          <Link href="/mining" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>⛏️ Mining</h3>
              <p className="item-description">
                Complete guide to The Mines, Skull Cavern, and mining locations.
              </p>
            </div>
          </Link>

          <Link href="/planner" style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>📋 Planner</h3>
              <p className="item-description">
                Plan your farm layout and crop rotations for maximum efficiency.
              </p>
            </div>
          </Link>
        </div>
      </main>
      <InstallPrompt />
    </>
  );
}
