/**
 * Embed Page - Embeddable campaign widget for external sites
 * Usage: <iframe src="/embed/{campaignId}" width="400" height="300" />
 */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Campaign } from '../types';
import { API_URL, formatAmount, calculateProgress } from '../lib/api';

export function EmbedPage() {
    const { id } = useParams<{ id: string }>();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetch(`${API_URL}/campaigns/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(setCampaign)
            .catch(() => setError('Campaign not found'));
    }, [id]);

    if (error) {
        return (
            <div style={styles.container}>
                <p style={styles.error}>{error}</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div style={styles.container}>
                <div style={styles.skeleton} />
            </div>
        );
    }

    const progress = calculateProgress(campaign.raised, campaign.goal);

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <span style={styles.badge}>GENESIS</span>
                <span style={styles.status}>{campaign.status.toUpperCase()}</span>
            </div>

            {/* Title */}
            <h2 style={styles.title}>{campaign.title}</h2>

            {/* Progress bar */}
            <div style={styles.progressTrack}>
                <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>

            {/* Stats row */}
            <div style={styles.statsRow}>
                <div>
                    <div style={styles.statValue}>{formatAmount(campaign.raised)} MON</div>
                    <div style={styles.statLabel}>RAISED</div>
                </div>
                {campaign.goal && (
                    <div style={{ textAlign: 'right' as const }}>
                        <div style={styles.statValue}>{formatAmount(campaign.goal)} MON</div>
                        <div style={styles.statLabel}>GOAL</div>
                    </div>
                )}
            </div>

            {/* CTA */}
            <a
                href={`${window.location.origin}/campaign/${campaign.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.cta}
            >
                DONATE ON GENESIS →
            </a>
        </div>
    );
}

// Inline styles so the embed works without loading Tailwind
const styles: Record<string, React.CSSProperties> = {
    container: {
        fontFamily: "'IBM Plex Mono', monospace",
        background: '#18181B',
        border: '1px solid #3F3F46',
        padding: '16px',
        maxWidth: '400px',
        color: '#FAFAFA',
        fontSize: '13px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    badge: {
        background: '#FF4D4D',
        color: '#000',
        padding: '2px 8px',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
    },
    status: {
        color: '#71717A',
        fontSize: '10px',
        letterSpacing: '0.1em',
    },
    title: {
        fontFamily: "'Satoshi', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        marginBottom: '12px',
        lineHeight: 1.3,
    },
    progressTrack: {
        background: '#27272A',
        height: '4px',
        width: '100%',
        marginBottom: '12px',
    },
    progressBar: {
        background: '#FF4D4D',
        height: '100%',
        transition: 'width 0.3s ease',
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px',
    },
    statValue: {
        fontFamily: "'Satoshi', sans-serif",
        fontSize: '16px',
        fontWeight: 700,
        color: '#FAFAFA',
    },
    statLabel: {
        fontSize: '10px',
        color: '#71717A',
        letterSpacing: '0.1em',
    },
    cta: {
        display: 'block',
        background: '#FF4D4D',
        color: '#000',
        padding: '10px',
        textAlign: 'center' as const,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textDecoration: 'none',
    },
    error: {
        color: '#FF4D4D',
        textAlign: 'center' as const,
        padding: '20px',
    },
    skeleton: {
        background: '#27272A',
        height: '120px',
        animation: 'pulse 2s infinite',
    },
};
