/**
 * ShareButtons - Industrial Brutalist
 */

import { Twitter, Share2, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
    title: string;
    url?: string;
    className?: string;
}

export function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    const handleTwitterShare = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            'twitter-share',
            'width=600,height=400'
        );
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="label">Share</span>

            {/* Twitter */}
            <button
                onClick={handleTwitterShare}
                className="p-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-accent hover:border-accent transition-colors"
                title="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </button>

            {/* Copy Link */}
            <button
                onClick={handleCopyLink}
                className="p-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-accent hover:border-accent transition-colors"
                title={copied ? 'Copied!' : 'Copy link'}
            >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4" />}
            </button>

            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && navigator.share && (
                <button
                    onClick={handleNativeShare}
                    className="p-2 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-accent hover:border-accent transition-colors"
                    title="Share"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
