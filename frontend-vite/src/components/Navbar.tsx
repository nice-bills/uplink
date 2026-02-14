/**
 * Navbar - Industrial Brutalist
 * Full-bleed dark, monospace nav, neon active states
 */

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, Zap } from 'lucide-react';

const navigation = [
  { name: 'HOME', href: '/' },
  { name: 'CAMPAIGNS', href: '/campaigns' },
  { name: 'LEADERBOARD', href: '/leaderboard' },
  { name: 'CREATE', href: '/create' },
  { name: 'PROFILE', href: '/profile' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-accent flex items-center justify-center relative">
              <Zap className="w-4 h-4 text-black" />
              {/* Corner notch */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-zinc-950"
                style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            </div>
            <span className="font-display text-lg font-bold text-zinc-50 tracking-tight group-hover:text-accent transition-colors">
              GENESIS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`mono text-xs px-4 py-2 transition-colors relative ${isActive(item.href)
                  ? 'text-accent'
                  : 'text-zinc-500 hover:text-zinc-50'
                  }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-accent" aria-hidden="true" />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet + Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <ConnectButton
                chainStatus="icon"
                showBalance={false}
              />
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="container py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block mono text-sm px-4 py-3 border-l-2 transition-colors ${isActive(item.href)
                  ? 'text-accent border-accent bg-zinc-800/50'
                  : 'text-zinc-400 border-transparent hover:text-zinc-50 hover:border-zinc-600'
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-zinc-800">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
