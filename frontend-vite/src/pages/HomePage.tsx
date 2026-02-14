/**
 * Home Page - Industrial Brutalist
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Grid3X3 } from 'lucide-react';
import { Hero } from '../components/Hero';
import { CampaignCard } from '../components/CampaignCard';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import type { Campaign, PlatformStats } from '../types';
import { getCampaigns, getStats } from '../lib/api';

export function HomePage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [campaignsData, statsData] = await Promise.all([
                    getCampaigns({ limit: 6, status: 'active' }),
                    getStats(),
                ]);
                setCampaigns(campaignsData);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen">
            <SEO />
            <Hero stats={stats ? {
                campaigns: stats.total_campaigns,
                raised: stats.total_raised,
                agents: stats.total_agents,
                donors: stats.total_donors,
            } : undefined} />

            {/* Campaigns Section */}
            <section className="py-16 relative">
                <div className="container">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="label flex items-center gap-3">
                            <Grid3X3 className="w-4 h-4 text-accent" />
                            ACTIVE CAMPAIGNS
                        </div>
                        <Link to="/campaigns">
                            <Button variant="secondary" size="sm">
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
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
                    ) : campaigns.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign, index) => (
                                <CampaignCard key={campaign.id} campaign={campaign} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card text-center py-16"
                        >
                            <div className="card-content">
                                <p className="text-zinc-500 mb-4 mono">No active campaigns yet</p>
                                <Link to="/create">
                                    <Button>Launch the first one</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
