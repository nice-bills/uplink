/**
 * SourceCard - Industrial Brutalist
 * Display the original tweet/post that created a campaign 
 */

import { ExternalLink, Twitter } from 'lucide-react';

interface SourceCardProps {
    platform?: string | null;
    authorHandle?: string | null;
    authorName?: string | null;
    authorAvatar?: string | null;
    content?: string | null;
    url?: string | null;
    timestamp?: string | null;
}

export function SourceCard({
    platform,
    authorHandle,
    authorName,
    authorAvatar,
    content,
    url,
    timestamp,
}: SourceCardProps) {
    if (!platform || !content) {
        return null;
    }

    const platformIcon = () => {
        switch (platform?.toLowerCase()) {
            case 'twitter':
            case 'x':
                return <Twitter className="w-4 h-4" />;
            case 'moltbook':
                return (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    return (
        <div className="card">
            <div className="px-4 py-3 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="status-dot" />
                    <span className="label">SOURCE</span>
                </div>
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-500 hover:text-accent transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            <div className="card-content">
                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                    {authorAvatar ? (
                        <img
                            src={authorAvatar}
                            alt={authorName || authorHandle || 'Author'}
                            className="w-10 h-10 rounded-full bg-zinc-800"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-400 text-sm font-medium">
                                {(authorHandle || '?')[0].toUpperCase()}
                            </span>
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-50 truncate">
                                {authorName || authorHandle}
                            </span>
                            <span className="text-zinc-500">{platformIcon()}</span>
                        </div>
                        {authorHandle && (
                            <span className="text-sm text-zinc-500 mono">
                                @{authorHandle.replace('@', '')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <p className="text-zinc-300 leading-relaxed mb-4">{content}</p>

                {/* Timestamp */}
                {timestamp && (
                    <p className="mono text-xs text-zinc-600">
                        {formatDate(timestamp)}
                    </p>
                )}
            </div>
        </div>
    );
}
