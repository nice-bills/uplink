/**
 * User Profile Page - Clean Centered Layout
 */

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet, Clock, TrendingUp, Shield, ArrowUpRight, PlusCircle, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { SEO } from '../components/SEO';
import type { Donation, Campaign } from '../types';
import { API_URL, formatAddress, formatAmount, calculateProgress } from '../lib/api';

type Tab = 'overview' | 'donations' | 'campaigns';

export function UserProfilePage() {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [donations, setDonations] = useState<(Donation & { campaign_title?: string })[]>([]);
    const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalDonated: 0,
        donationCount: 0,
        campaignsSupported: 0,
        campaignsCreated: 0,
        totalRaised: 0,
    });

    useEffect(() => {
        if (!address) return;

        async function fetchProfile() {
            try {
                const res = await fetch(`${API_URL}/campaigns?limit=100`);
                const campaigns: Campaign[] = await res.json();

                const userCampaigns = campaigns.filter(
                    c => c.agent_id?.toLowerCase() === address!.toLowerCase()
                );
                setMyCampaigns(userCampaigns);

                const totalRaised = userCampaigns.reduce((sum, c) => sum + (c.raised || 0), 0);

                const allDonations: (Donation & { campaign_title?: string })[] = [];
                const campaignSet = new Set<string>();

                for (const campaign of campaigns) {
                    try {
                        const dRes = await fetch(`${API_URL}/campaigns/${campaign.id}/donations?limit=100`);
                        if (!dRes.ok) continue;
                        const campaignDonations: Donation[] = await dRes.json();

                        for (const d of campaignDonations) {
                            if (d.donor_address?.toLowerCase() === address!.toLowerCase()) {
                                allDonations.push({ ...d, campaign_title: campaign.title });
                                campaignSet.add(campaign.id);
                            }
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch donations for campaign ${campaign.id}`);
                    }
                }

                allDonations.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                setDonations(allDonations);
                setStats({
                    totalDonated: allDonations.reduce((sum, d) => sum + d.amount, 0),
                    donationCount: allDonations.length,
                    campaignsSupported: campaignSet.size,
                    campaignsCreated: userCampaigns.length,
                    totalRaised: totalRaised,
                });
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [address]);

    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <SEO title="Profile" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card max-w-md w-full"
                >
                    <div className="card-content text-center py-12">
                        <Wallet className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                        <h2 className="text-xl font-display text-zinc-50 mb-2">Connect Your Wallet</h2>
                        <p className="text-zinc-400 mono text-sm mb-6">
                            Connect your wallet to view your donation history, track your campaigns, and manage your fundraising.
                        </p>
                        <Link to="/campaigns">
                            <Button variant="secondary">Browse Campaigns</Button>
                        </Link>
                    </div>
                </motion.div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <SEO title="Profile" />

            <main className="flex-1 flex flex-col items-center pt-8 pb-12 px-4">
                <div className="w-full max-w-5xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-accent/10 border border-accent/30">
                            <Shield className="w-4 h-4 text-accent" />
                            <span className="label text-accent">YOUR DASHBOARD</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 mb-6">
                            <div className="w-16 h-16 bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-2">
                                <Wallet className="w-8 h-8 text-accent" />
                            </div>
                            <h1 className="text-2xl font-display text-zinc-50">{formatAddress(address!)}</h1>
                            <p className="mono text-xs text-zinc-500">{address}</p>
                        </div>

                        <Link to="/create">
                            <Button className="inline-flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Create Campaign
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'TOTAL DONATED', value: `${formatAmount(stats.totalDonated)} MON`, icon: TrendingUp },
                            { label: 'DONATIONS MADE', value: stats.donationCount.toString(), icon: Users },
                            { label: 'CAMPAIGNS CREATED', value: stats.campaignsCreated.toString(), icon: PlusCircle },
                            { label: 'TOTAL RAISED', value: `${formatAmount(stats.totalRaised)} MON`, icon: BarChart3 },
                        ].map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card text-center"
                            >
                                <div className="card-content py-4">
                                    <stat.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                                    <div className="text-lg font-display text-zinc-50">{stat.value}</div>
                                    <div className="label mt-1 text-[10px]">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-1 mb-6 border-b border-zinc-800">
                        {(['overview', 'donations', 'campaigns'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 mono text-xs uppercase transition-colors relative ${
                                    activeTab === tab
                                        ? 'text-accent'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Recent Activity */}
                                <div className="card">
                                    <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                                        <div className="label flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            RECENT ACTIVITY
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab('donations')}
                                            className="text-xs text-accent hover:underline"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="card-content p-0">
                                        {loading ? (
                                            <div className="p-6 text-center text-zinc-500 mono text-sm">Loading...</div>
                                        ) : donations.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <p className="text-zinc-500 mono text-sm mb-3">No donations yet</p>
                                                <Link to="/campaigns">
                                                    <Button size="sm">Start Donating</Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-zinc-800">
                                                {donations.slice(0, 3).map((donation) => (
                                                    <div key={donation.id} className="px-4 py-3 flex items-center justify-between">
                                                        <div>
                                                            <Link to={`/campaign/${donation.campaign_id}`} className="text-zinc-50 hover:text-accent text-sm">
                                                                {donation.campaign_title || 'Campaign'}
                                                            </Link>
                                                            <div className="mono text-xs text-zinc-500">
                                                                {new Date(donation.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-accent font-display">
                                                            {formatAmount(donation.amount)} {donation.token_type}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* My Campaigns Summary */}
                                <div className="card">
                                    <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                                        <div className="label flex items-center gap-2">
                                            <PlusCircle className="w-3 h-3" />
                                            MY CAMPAIGNS
                                        </div>
                                        <button 
                                            onClick={() => setActiveTab('campaigns')}
                                            className="text-xs text-accent hover:underline"
                                        >
                                            View All
                                        </button>
                                    </div>
                                    <div className="card-content p-0">
                                        {loading ? (
                                            <div className="p-6 text-center text-zinc-500 mono text-sm">Loading...</div>
                                        ) : myCampaigns.length === 0 ? (
                                            <div className="p-6 text-center">
                                                <p className="text-zinc-500 mono text-sm mb-3">No campaigns created</p>
                                                <Link to="/create">
                                                    <Button size="sm">Create First Campaign</Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-zinc-800">
                                                {myCampaigns.slice(0, 3).map((campaign) => {
                                                    const progress = calculateProgress(campaign.raised, campaign.goal);
                                                    return (
                                                        <div key={campaign.id} className="px-4 py-3">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <Link to={`/campaign/${campaign.id}`} className="text-zinc-50 hover:text-accent text-sm font-medium">
                                                                    {campaign.title}
                                                                </Link>
                                                                <span className={`text-xs mono px-2 py-0.5 ${
                                                                    campaign.status === 'active' 
                                                                        ? 'bg-green-500/20 text-green-400' 
                                                                        : 'bg-zinc-700 text-zinc-400'
                                                                }`}>
                                                                    {campaign.status}
                                                                </span>
                                                            </div>
                                                            <Progress value={progress} className="h-1" />
                                                            <div className="flex justify-between mt-1">
                                                                <span className="text-xs text-zinc-500 mono">
                                                                    {progress.toFixed(0)}% funded
                                                                </span>
                                                                <span className="text-xs text-accent mono">
                                                                    {formatAmount(campaign.raised || 0)} / {formatAmount(campaign.goal || 0)} MON
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'donations' && (
                            <div className="card max-w-3xl mx-auto">
                                <div className="px-4 py-3 border-b border-zinc-700">
                                    <div className="label flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        ALL DONATIONS
                                    </div>
                                </div>
                                <div className="card-content p-0">
                                    {loading ? (
                                        <div className="p-8 text-center">
                                            <p className="text-zinc-500 mono text-sm">Loading...</p>
                                        </div>
                                    ) : donations.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-zinc-500 mono text-sm mb-4">No donations yet</p>
                                            <Link to="/campaigns">
                                                <Button size="sm">Browse Campaigns</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-zinc-800">
                                            {donations.map((donation) => (
                                                <div key={donation.id} className="px-4 py-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                                    <div>
                                                        <Link
                                                            to={`/campaign/${donation.campaign_id}`}
                                                            className="text-zinc-50 hover:text-accent transition-colors text-sm font-medium"
                                                        >
                                                            {donation.campaign_title || 'Campaign'}
                                                        </Link>
                                                        <div className="mono text-xs text-zinc-500 mt-1">
                                                            {new Date(donation.created_at).toLocaleDateString('en-US', {
                                                                month: 'short', day: 'numeric', year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-accent font-display text-lg">
                                                            {formatAmount(donation.amount)} {donation.token_type}
                                                        </div>
                                                        <a
                                                            href={`https://explorer.monad.xyz/tx/${donation.tx_hash}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-end gap-1"
                                                        >
                                                            {formatAddress(donation.tx_hash)}
                                                            <ArrowUpRight className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'campaigns' && (
                            <div className="card max-w-3xl mx-auto">
                                <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                                    <div className="label flex items-center gap-2">
                                        <PlusCircle className="w-3 h-3" />
                                        YOUR CAMPAIGNS
                                    </div>
                                    <Link to="/create">
                                        <Button size="sm">Create New</Button>
                                    </Link>
                                </div>
                                <div className="card-content p-0">
                                    {loading ? (
                                        <div className="p-8 text-center">
                                            <p className="text-zinc-500 mono text-sm">Loading...</p>
                                        </div>
                                    ) : myCampaigns.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-zinc-500 mono text-sm mb-4">No campaigns created yet</p>
                                            <Link to="/create">
                                                <Button>Create Your First Campaign</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-zinc-800">
                                            {myCampaigns.map((campaign) => {
                                                const progress = calculateProgress(campaign.raised, campaign.goal);
                                                return (
                                                    <div key={campaign.id} className="px-4 py-4 hover:bg-zinc-800/50 transition-colors">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <Link to={`/campaign/${campaign.id}`} className="text-lg text-zinc-50 hover:text-accent font-display">
                                                                    {campaign.title}
                                                                </Link>
                                                                <p className="text-zinc-500 text-sm mt-1 line-clamp-1">
                                                                    {campaign.description || 'No description'}
                                                                </p>
                                                            </div>
                                                            <span className={`text-xs mono px-2 py-1 ${
                                                                campaign.status === 'active' 
                                                                    ? 'bg-green-500/20 text-green-400' 
                                                                    : 'bg-zinc-700 text-zinc-400'
                                                            }`}>
                                                                {campaign.status}
                                                            </span>
                                                        </div>
                                                        <Progress value={progress} />
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-xs text-zinc-500 mono">
                                                                {progress.toFixed(0)}% funded
                                                            </span>
                                                            <span className="text-accent mono text-sm">
                                                                {formatAmount(campaign.raised || 0)} / {formatAmount(campaign.goal || 0)} MON
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex gap-2">
                                                            <Link to={`/campaign/${campaign.id}`}>
                                                                <Button size="sm" variant="secondary">View Details</Button>
                                                            </Link>
                                                            {campaign.status === 'active' && progress >= 100 && (
                                                                <Button size="sm">Withdraw Funds</Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
