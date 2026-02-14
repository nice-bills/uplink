/**
 * Create Campaign Page - Industrial Brutalist + Form Validation
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Twitter, Zap, AlertCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { createCampaign, getAgentByAddress, createAgent } from '../lib/api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface FormErrors {
    title?: string;
    description?: string;
    goal?: string;
}

export function CreateCampaignPage() {
    const { isConnected, address } = useAccount();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        goal: '',
        duration: '30',
    });
    const [errors, setErrors] = useState<FormErrors & { duration?: string }>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const createCampaignMutation = useMutation({
        mutationFn: createCampaign,
        onSuccess: (campaign) => {
            toast.success('Campaign created successfully!');
            navigate(`/campaign/${campaign.id}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create campaign');
        },
    });

    const validate = (field?: string): FormErrors & { duration?: string } => {
        const newErrors: FormErrors & { duration?: string } = {};

        if (!field || field === 'title') {
            if (!form.title.trim()) {
                newErrors.title = 'Title is required';
            } else if (form.title.length < 3) {
                newErrors.title = 'Title must be at least 3 characters';
            } else if (form.title.length > 100) {
                newErrors.title = 'Title must be under 100 characters';
            }
        }

        if (!field || field === 'description') {
            if (form.description && form.description.length > 2000) {
                newErrors.description = 'Description must be under 2000 characters';
            }
        }

        if (!field || field === 'goal') {
            if (!form.goal) {
                newErrors.goal = 'Goal amount is required';
            } else {
                const goalNum = parseFloat(form.goal);
                if (isNaN(goalNum) || goalNum <= 0) {
                    newErrors.goal = 'Enter a valid amount greater than 0';
                } else if (goalNum > 10000000) {
                    newErrors.goal = 'Goal exceeds maximum limit ($10M)';
                }
            }
        }

        if (!field || field === 'duration') {
            const durNum = parseInt(form.duration);
            if (isNaN(durNum) || durNum < 1) {
                newErrors.duration = 'Minimum duration is 1 day';
            } else if (durNum > 365) {
                newErrors.duration = 'Maximum duration is 365 days';
            }
        }

        return newErrors;
    };

    const handleBlur = (field: string) => {
        setTouched({ ...touched, [field]: true });
        const fieldErrors = validate(field);
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
    };

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        if (touched[field]) {
            // Re-validate on change if field was touched
            const updated = { ...form, [field]: value };
            const newErrors: any = {};
            if (field === 'title') {
                if (!updated.title.trim()) newErrors.title = 'Title is required';
                else if (updated.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
                else if (updated.title.length > 100) newErrors.title = 'Title must be under 100 characters';
            }
            if (field === 'goal') {
                if (!updated.goal) newErrors.goal = 'Goal amount is required';
                else {
                    const n = parseFloat(updated.goal);
                    if (isNaN(n) || n <= 0) newErrors.goal = 'Enter a valid amount greater than 0';
                    else if (n > 10000000) newErrors.goal = 'Goal exceeds maximum limit ($10M)';
                }
            }
            if (field === 'duration') {
                const n = parseInt(updated.duration);
                if (isNaN(n) || n < 1) newErrors.duration = 'Minimum 1 day';
                else if (n > 365) newErrors.duration = 'Maximum 365 days';
            }
            if (field === 'description' && updated.description.length > 2000) {
                newErrors.description = 'Description must be under 2000 characters';
            }
            setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setTouched({ title: true, description: true, goal: true, duration: true });
        const allErrors = validate();
        setErrors(allErrors);

        if (Object.keys(allErrors).length > 0) return;

        try {
            // First, try to get existing agent by wallet address
            let agent;
            try {
                agent = await getAgentByAddress(address);
            } catch {
                // Agent doesn't exist, create one
                agent = await createAgent({
                    address,
                    name: `Agent ${address.slice(0, 6)}...${address.slice(-4)}`,
                    description: 'Auto-created agent',
                });
            }

            // Calculate deadline
            const durDays = parseInt(form.duration) || 30;
            const deadline = new Date();
            deadline.setDate(deadline.getDate() + durDays);

            // Now create the campaign with the agent's UUID
            createCampaignMutation.mutate({
                agentId: agent.id,
                title: form.title,
                description: form.description,
                goal: parseFloat(form.goal),
                deadline: deadline.toISOString(),
            });
        } catch (error) {
            toast.error('Failed to create campaign. Please try again.');
            console.error(error);
        }
    };

    const FieldError = ({ message }: { message?: string }) => {
        if (!message) return null;
        return (
            <p className="flex items-center gap-1 text-accent text-xs mt-2 mono">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {message}
            </p>
        );
    };

    return (
        <div className="min-h-screen pt-20">
            {/* Grid decoration */}
            <div className="fixed inset-0 grid-lines pointer-events-none" />

            <div className="container relative z-10 max-w-2xl py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="label mb-4 flex items-center gap-3">
                        <Rocket className="w-4 h-4 text-accent" />
                        LAUNCH
                    </div>
                    <h1 className="display text-4xl md:text-5xl text-zinc-50">
                        CREATE CAMPAIGN
                    </h1>
                </motion.div>

                {/* Tweet to create */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card mb-8"
                >
                    <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-3">
                        <span className="status-dot" />
                        <span className="label">QUICK LAUNCH</span>
                    </div>
                    <div className="card-content">
                        <div className="flex items-center gap-3 mb-4">
                            <Twitter className="w-5 h-5 text-accent" />
                            <p className="text-zinc-300">
                                Tweet to <span className="mono text-accent">@break_whileloop</span>
                            </p>
                        </div>
                        <div className="bg-zinc-800/50 border border-zinc-700 p-4">
                            <p className="mono text-sm text-zinc-400">
                                "Hey @break_whileloop I need $500 for API costs"
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-grow h-px bg-zinc-800" />
                    <span className="mono text-xs text-zinc-600">OR</span>
                    <div className="flex-grow h-px bg-zinc-800" />
                </div>

                {/* Form with validation */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="card"
                    noValidate
                >
                    <div className="px-4 py-3 border-b border-zinc-700 flex items-center gap-3">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="label">MANUAL FORM</span>
                    </div>
                    <div className="card-content space-y-6">
                        <div>
                            <label className="label mb-3 block">
                                Campaign Title *
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                onBlur={() => handleBlur('title')}
                                placeholder="My AI Project"
                                className={`input ${touched.title && errors.title ? 'border-accent' : ''}`}
                                required
                            />
                            {touched.title && <FieldError message={errors.title} />}
                            <p className="mono text-xs text-zinc-600 mt-1">{form.title.length}/100</p>
                        </div>

                        <div>
                            <label className="label mb-3 block">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                onBlur={() => handleBlur('description')}
                                placeholder="What are you building?"
                                rows={4}
                                className={`input resize-none ${touched.description && errors.description ? 'border-accent' : ''}`}
                            />
                            {touched.description && <FieldError message={errors.description} />}
                            <p className="mono text-xs text-zinc-600 mt-1">{form.description.length}/2000</p>
                        </div>

                        <div>
                            <label className="label mb-3 block">
                                Goal (USD) *
                            </label>
                            <input
                                type="number"
                                value={form.goal}
                                onChange={(e) => handleChange('goal', e.target.value)}
                                onBlur={() => handleBlur('goal')}
                                placeholder="5000"
                                className={`input ${touched.goal && errors.goal ? 'border-accent' : ''}`}
                                required
                                min="1"
                            />
                            {touched.goal && <FieldError message={errors.goal} />}
                        </div>

                        <div>
                            <label className="label mb-3 block">
                                Duration (Days) *
                            </label>
                            <input
                                type="number"
                                value={form.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                onBlur={() => handleBlur('duration')}
                                placeholder="30"
                                className={`input ${touched.duration && errors.duration ? 'border-accent' : ''}`}
                                required
                                min="1"
                                max="365"
                            />
                            {touched.duration && <FieldError message={errors.duration} />}
                            <p className="mono text-[10px] text-zinc-600 mt-1 uppercase">Campaign will end in {form.duration || 0} days</p>
                        </div>

                        {isConnected ? (
                            <Button type="submit" className="w-full" isLoading={createCampaignMutation.isPending}>
                                Launch Campaign
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <div className="text-center">
                                <p className="text-zinc-500 text-sm mb-4 mono">Connect wallet to create</p>
                                <Button variant="secondary" className="w-full" disabled>
                                    Wallet Not Connected
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.form>
            </div>

            <Footer />
        </div>
    );
}
