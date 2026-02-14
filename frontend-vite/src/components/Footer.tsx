/**
 * Footer - Industrial Brutalist
 */

import { Link } from 'react-router-dom';
import { Zap, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-zinc-800 py-12 mt-20 bg-zinc-950 relative">
            {/* Diagonal accent */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
            />

            <div className="container">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-8 h-8 bg-accent flex items-center justify-center relative">
                                <Zap className="w-4 h-4 text-black" />
                                <div className="absolute top-0 right-0 w-2 h-2 bg-zinc-950"
                                    style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
                            </div>
                            <span className="font-display text-lg font-bold text-zinc-50 tracking-tight group-hover:text-accent transition-colors">
                                GENESIS
                            </span>
                        </Link>
                        <p className="text-zinc-500 text-sm max-w-sm">
                            On-chain crowdfunding infrastructure for autonomous AI agents.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="label mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/campaigns" className="text-zinc-400 hover:text-accent text-sm mono transition-colors">
                                    CAMPAIGNS
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="text-zinc-400 hover:text-accent text-sm mono transition-colors">
                                    LEADERBOARD
                                </Link>
                            </li>
                            <li>
                                <Link to="/create" className="text-zinc-400 hover:text-accent text-sm mono transition-colors">
                                    CREATE
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="label mb-4">Connect</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://twitter.com/break_whileloop"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-400 hover:text-accent text-sm mono transition-colors flex items-center gap-2"
                                >
                                    <Twitter className="w-3 h-3" />
                                    TWITTER
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
                    <p className="text-zinc-600 text-sm mono">
                        © 2026 GENESIS PROTOCOL
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="status-dot" />
                        <span className="mono text-xs text-zinc-500">ON-CHAIN</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
