/**
 * Campaign Detail Page - Industrial Brutalist
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, Copy, Wallet, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { SourceCard } from '../components/SourceCard';
import { ShareButtons } from '../components/ShareButtons';
import { useDonate } from '../hooks/useDonate';
import type { Campaign } from '../types';
import { getCampaign, formatAmount, calculateProgress, formatAddress } from '../lib/api';

// Platform Treasury Address - All campaigns use this shared treasury during probation
const PLATFORM_TREASURY_ADDRESS = '0xEd4eb043c9faAd76B1Ec5a4522495813099FF77A';

export function CampaignDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaign() {
            if (!id) return;
            try {
                const data = await getCampaign(id);
                setCampaign(data);
            } catch (error) {
                console.error('Failed to fetch campaign:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCampaign();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20">
                <div className="container max-w-4xl py-12">
                    <div className="card animate-pulse">
                        <div className="px-4 py-3 border-b border-zinc-700">
                            <div className="h-4 bg-zinc-700 rounded w-24" />
                        </div>
                        <div className="card-content">
                            <div className="h-8 bg-zinc-700 rounded w-3/4 mb-4" />
                            <div className="h-4 bg-zinc-800 rounded w-full mb-2" />
                            <div className="h-4 bg-zinc-800 rounded w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen pt-20">
                <div className="container max-w-4xl py-12 text-center">
                    <h1 className="text-2xl font-display font-bold text-zinc-50 mb-4">Campaign not found</h1>
                    <Link to="/campaigns">
                        <Button variant="secondary">Back to Campaigns</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const progress = calculateProgress(campaign.raised, campaign.goal);

    return (
        <div className="min-h-screen pt-20">
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#18181B',
                    color: '#FAFAFA',
                    border: '1px solid #3F3F46',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.875rem',
                },
            }} />

            {/* Grid decoration */}
            <div className="fixed inset-0 grid-lines pointer-events-none" />

            <div className="container relative z-10 max-w-4xl py-12">
                {/* Back link */}
                <Link to="/campaigns" className="inline-flex items-center gap-2 text-zinc-500 hover:text-accent mb-6 text-sm mono transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    BACK TO CAMPAIGNS
                </Link>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3"
                    >
                        <div className="card">
                            <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-3">
                                <span className={`status-dot ${campaign.status !== 'active' ? 'opacity-30 !bg-zinc-500' : ''}`} />
                                <span className="label">
                                    {campaign.status === 'active' ? 'ACTIVE' : 'COMPLETED'}
                                </span>
                            </div>
                            <div className="card-content">
                                <h1 className="text-2xl font-display font-bold text-zinc-50 mb-4">
                                    {campaign.title}
                                </h1>
                                <p className="text-zinc-400 leading-relaxed mb-4">
                                    {campaign.description || 'No description provided.'}
                                </p>
                                <ShareButtons title={campaign.title} className="mt-4" />
                            </div>
                        </div>

                        {/* Source Card */}
                        <div className="mt-6">
                            <SourceCard
                                platform={campaign.source_platform}
                                authorHandle={campaign.source_author_handle}
                                authorName={campaign.source_author_name}
                                authorAvatar={campaign.source_author_avatar}
                                content={campaign.source_content}
                                url={campaign.source_url}
                                timestamp={campaign.source_timestamp}
                            />
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="card sticky top-24">
                            <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-3">
                                <span className="status-dot" />
                                <span className="label">FUNDING</span>
                            </div>
                            <div className="card-content">
                                {/* Progress */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="data text-2xl">
                                            ${formatAmount(campaign.raised)}
                                        </span>
                                        <span className="text-zinc-500 text-sm mono">
                                            / ${formatAmount(campaign.goal || 0)}
                                        </span>
                                    </div>
                                    <Progress value={progress} />
                                    <div className="mono text-xs text-zinc-500 mt-2">
                                        {progress.toFixed(0)}% funded
                                    </div>
                                </div>

                                {/* Treasury Address - Always show platform shared treasury */}
                                <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="w-4 h-4 text-accent" />
                                        <span className="label text-xs">RECEIVING ADDRESS</span>
                                    </div>
                                    <p className="text-zinc-400 text-xs mb-2">Send MON directly to this address:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-zinc-900 px-3 py-2 rounded text-xs text-zinc-300 break-all font-mono">
                                            {PLATFORM_TREASURY_ADDRESS}
                                        </code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(PLATFORM_TREASURY_ADDRESS);
                                                toast.success('Address copied!');
                                            }}
                                            className="p-2 hover:bg-zinc-700 rounded transition-colors"
                                            title="Copy address"
                                        >
                                            <Copy className="w-4 h-4 text-zinc-400" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-zinc-500 text-xs">
                                        <Info className="w-3 h-3" />
                                        <span>Funds held in treasury during probation period (3-5 days)</span>
                                    </div>
                                </div>

                                {/* Donation Form */}
                                {campaign.status === 'active' && (
                                    <DonationForm campaignId={campaign.id} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

/**
 * DonationForm - Handles donation input and transaction with validation
 */
function DonationForm({ campaignId }: { campaignId: string }) {
    const [amount, setAmount] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [validationError, setValidationError] = useState('');

    const { donate, isLoading, isPending, error } = useDonate({
        campaignId,
        onSuccess: (txHash) => {
            toast.success(`Donation successful! TX: ${txHash.slice(0, 10)}...`);
            setAmount('');
            setValidationError('');
            setIsAnonymous(false);
        },
        onError: (err) => {
            toast.error(err.message || 'Transaction failed');
        },
    });

    const validateAmount = (value: string): string => {
        if (!value) return 'Amount is required';
        const num = parseFloat(value);
        if (isNaN(num)) return 'Enter a valid number';
        if (num <= 0) return 'Amount must be greater than 0';
        if (num > 1000000) return 'Amount exceeds maximum limit';
        return '';
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);
        if (validationError) {
            setValidationError(validateAmount(value));
        }
    };

    const handleDonate = async () => {
        const error = validateAmount(amount);
        if (error) {
            setValidationError(error);
            return;
        }
        setValidationError('');
        await donate(parseFloat(amount));
    };

    return (
        <>
            <div className="mb-4">
                <label className="label mb-3 block">
                    Amount (MON)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    onBlur={() => setValidationError(validateAmount(amount))}
                    placeholder="0.00"
                    className={`input ${validationError ? 'border-accent' : ''}`}
                    disabled={isLoading}
                />
                {validationError && (
                    <p className="flex items-center gap-1 text-accent text-xs mt-2 mono">
                        <AlertCircle className="w-3 h-3" />
                        {validationError}
                    </p>
                )}
            </div>

            {/* Anonymous toggle */}
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                <div className="relative">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="sr-only peer"
                        disabled={isLoading}
                    />
                    <div className="w-8 h-4 bg-zinc-700 border border-zinc-600 peer-checked:bg-accent/30 peer-checked:border-accent transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-zinc-400 peer-checked:bg-accent peer-checked:translate-x-4 transition-all" />
                </div>
                <span className="mono text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    Donate anonymously
                </span>
            </label>

            <Button
                className="w-full"
                onClick={handleDonate}
                disabled={isLoading || !amount}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isPending ? 'Confirming...' : 'Processing...'}
                    </>
                ) : (
                    'Donate Now'
                )}
            </Button>
            {error && (
                <p className="text-accent text-xs mt-2 mono">{error.message}</p>
            )}
        </>
    );
}
