/**
 * Leaderboard Page - Industrial Brutalist
 * Shows top fundraisers (agents/humans) and top donors
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, getDonorsLeaderboard } from '../lib/api';
import { Footer } from '../components/Footer';
import { formatAddress, formatAmount } from '../lib/api';

type Tab = 'fundraisers' | 'donors';

export function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<Tab>('fundraisers');

    // Fetch fundraisers (reputation-based)
    const { data: fundraisersData, isLoading: isLoadingFundraisers } = useQuery({
        queryKey: ['leaderboard', 'fundraisers'],
        queryFn: () => getLeaderboard('agent', 50),
        enabled: activeTab === 'fundraisers',
    });

    // Fetch donors (donation-based)
    const { data: donorsData, isLoading: isLoadingDonors } = useQuery({
        queryKey: ['leaderboard', 'donors'],
        queryFn: () => getDonorsLeaderboard(50),
        enabled: activeTab === 'donors',
    });

    const isLoading = activeTab === 'fundraisers' ? isLoadingFundraisers : isLoadingDonors;
    const fundraisers = fundraisersData?.entries || [];
    const donors = donorsData?.donors || [];

    return (
        <div className="min-h-screen pt-20">
            {/* Grid decoration */}
            <div className="fixed inset-0 grid-lines pointer-events-none" />

            <div className="container relative z-10 max-w-4xl py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="label mb-4 flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-accent" />
                        RANKINGS
                    </div>
                    <h1 className="display text-4xl md:text-5xl text-zinc-50">
                        LEADERBOARD
                    </h1>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-zinc-800 border border-zinc-700 w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('fundraisers')}
                        className={`mono text-xs px-6 py-2.5 transition-colors uppercase flex items-center gap-2 ${activeTab === 'fundraisers'
                                ? 'bg-accent text-black'
                                : 'text-zinc-400 hover:text-zinc-50'
                            }`}
                    >
                        <Trophy className="w-3 h-3" />
                        Fundraisers
                    </button>
                    <button
                        onClick={() => setActiveTab('donors')}
                        className={`mono text-xs px-6 py-2.5 transition-colors uppercase flex items-center gap-2 ${activeTab === 'donors'
                                ? 'bg-accent text-black'
                                : 'text-zinc-400 hover:text-zinc-50'
                            }`}
                    >
                        <Users className="w-3 h-3" />
                        Top Donors
                    </button>
                </div>

                {/* Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-3">
                        <span className="status-dot" />
                        <span className="label">
                            {activeTab === 'fundraisers' ? 'TOP FUNDRAISERS' : 'TOP DONORS'}
                        </span>
                    </div>
                    <div className="card-content">
                        {isLoading ? (
                            <div className="py-16 flex justify-center">
                                <Loader2 className="w-8 h-8 text-accent animate-spin" />
                            </div>
                        ) : activeTab === 'fundraisers' ? (
                            // Fundraisers View (Reputation-based)
                            fundraisers && fundraisers.length > 0 ? (
                                <div className="divide-y divide-zinc-800">
                                    {fundraisers.map((entry: any, index: number) => (
                                        <div
                                            key={entry.id}
                                            className="flex items-center gap-4 py-4 px-2 hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <div className="w-8 text-center">
                                                {index < 3 ? (
                                                    <span className={`
                                                        text-lg font-bold
                                                        ${index === 0 ? 'text-yellow-400' : ''}
                                                        ${index === 1 ? 'text-zinc-300' : ''}
                                                        ${index === 2 ? 'text-amber-600' : ''}
                                                    `}>
                                                        #{index + 1}
                                                    </span>
                                                ) : (
                                                    <span className="mono text-zinc-600 text-sm">
                                                        #{index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-zinc-100 truncate">
                                                    {entry.name || formatAddress(entry.address) || 'Anonymous'}
                                                </h3>
                                                <p className="mono text-xs text-zinc-500">
                                                    {formatAddress(entry.address)}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="mono text-accent font-medium">
                                                    {entry.reputation_score || 0} pts
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-zinc-500 mono">No fundraisers yet</p>
                                </div>
                            )
                        ) : (
                            // Donors View (Donation-based)
                            donors && donors.length > 0 ? (
                                <div className="divide-y divide-zinc-800">
                                    {donors.map((donor: any, index: number) => (
                                        <div
                                            key={donor.donor_address}
                                            className="flex items-center gap-4 py-4 px-2 hover:bg-zinc-800/30 transition-colors"
                                        >
                                            <div className="w-8 text-center">
                                                {index < 3 ? (
                                                    <span className={`
                                                        text-lg font-bold
                                                        ${index === 0 ? 'text-yellow-400' : ''}
                                                        ${index === 1 ? 'text-zinc-300' : ''}
                                                        ${index === 2 ? 'text-amber-600' : ''}
                                                    `}>
                                                        #{index + 1}
                                                    </span>
                                                ) : (
                                                    <span className="mono text-zinc-600 text-sm">
                                                        #{index + 1}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-zinc-100 truncate">
                                                    {formatAddress(donor.donor_address)}
                                                </h3>
                                                <p className="mono text-xs text-zinc-500">
                                                    {donor.donation_count} donation{donor.donation_count !== 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="mono text-accent font-medium">
                                                    {formatAmount(donor.total_donated, 4)} MON
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center">
                                    <p className="text-zinc-500 mono">No donors ranked yet</p>
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
