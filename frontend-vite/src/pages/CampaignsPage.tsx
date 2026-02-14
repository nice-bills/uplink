/**
 * Campaigns Page - Industrial Brutalist
 */

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown, Grid3X3 } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { Footer } from '../components/Footer';
import type { Campaign } from '../types';
import { getCampaigns } from '../lib/api';

type SortOption = 'newest' | 'funded' | 'ending';

export function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    useEffect(() => {
        async function fetchCampaigns() {
            try {
                const status = filter === 'all' ? undefined : filter;
                const data = await getCampaigns({ limit: 50, status });
                setCampaigns(data);
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCampaigns();
    }, [filter]);

    const sortedCampaigns = useMemo(() => {
        let filtered = campaigns.filter((campaign) =>
            campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'funded':
                filtered.sort((a, b) => (b.raised || 0) - (a.raised || 0));
                break;
            case 'ending':
                filtered.sort((a, b) => {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                });
                break;
        }

        return filtered;
    }, [campaigns, searchTerm, sortBy]);

    return (
        <div className="min-h-screen pt-20">
            {/* Grid decoration */}
            <div className="fixed inset-0 grid-lines pointer-events-none" />

            <div className="container relative z-10 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="label mb-4 flex items-center gap-3">
                        <Grid3X3 className="w-4 h-4 text-accent" />
                        BROWSE CAMPAIGNS
                    </div>
                    <h1 className="display text-4xl md:text-5xl text-zinc-50">
                        ALL CAMPAIGNS
                    </h1>
                </motion.div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-12"
                        />
                    </div>

                    <div className="flex gap-1 p-1 bg-zinc-800 border border-zinc-700">
                        {(['all', 'active', 'completed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`mono text-xs px-4 py-2 transition-colors uppercase ${filter === status
                                        ? 'bg-accent text-black'
                                        : 'text-zinc-400 hover:text-zinc-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="input appearance-none pr-10 cursor-pointer mono text-sm"
                        >
                            <option value="newest">Newest First</option>
                            <option value="funded">Most Funded</option>
                            <option value="ending">Ending Soon</option>
                        </select>
                        <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                {/* Campaigns Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="px-4 py-3 border-b border-zinc-700">
                                    <div className="h-4 bg-zinc-700 rounded w-24" />
                                </div>
                                <div className="card-content">
                                    <div className="h-5 bg-zinc-700 rounded w-3/4 mb-3" />
                                    <div className="h-4 bg-zinc-800 rounded w-full mb-4" />
                                    <div className="h-2 bg-zinc-800 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : sortedCampaigns.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedCampaigns.map((campaign, index) => (
                            <CampaignCard key={campaign.id} campaign={campaign} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-16">
                        <p className="text-zinc-500 mono">No campaigns found</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
