/**
 * Curated cinematic media — multiple videos and stills (no Midjourney).
 * Swap URLs here to change site-wide visuals.
 */

export type MediaKind = 'video' | 'image';

export interface MediaAsset {
  id: string;
  kind: MediaKind;
  src: string;
  alt: string;
  /** Optional poster for video (shown while loading / reduced motion) */
  poster?: string;
}

/** Hero + per-route ambient backgrounds */
export const PAGE_BACKGROUNDS = {
  home: {
    id: 'hero-orbit',
    kind: 'video' as const,
    src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
    alt: 'Slow orbital light over deep water',
    poster:
      'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80',
  },
  campaigns: {
    id: 'campaigns-grid',
    kind: 'image' as const,
    src: 'https://images.unsplash.com/photo-1635070041078-e43dcbf05e79?auto=format&fit=crop&w=2400&q=80',
    alt: 'Neural network visualization in blue',
  },
  leaderboard: {
    id: 'leaderboard-rise',
    kind: 'video' as const,
    src: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
    alt: 'City lights rising through fog at night',
    poster:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80',
  },
  create: {
    id: 'create-signal',
    kind: 'image' as const,
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2400&q=80',
    alt: 'Abstract AI-generated light forms',
  },
  profile: {
    id: 'profile-depth',
    kind: 'image' as const,
    src: 'https://images.unsplash.com/photo-1451187580458-ede158ae7c8f?auto=format&fit=crop&w=2400&q=80',
    alt: 'Earth from orbit with city lights',
  },
  campaignDetail: {
    id: 'detail-flow',
    kind: 'video' as const,
    src: 'https://videos.pexels.com/video-files/3252992/3252992-uhd_2560_1440_25fps.mp4',
    alt: 'Abstract fluid light trails',
    poster:
      'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80',
  },
  embed: {
    id: 'embed-minimal',
    kind: 'image' as const,
    src: 'https://images.unsplash.com/photo-1614728263952-487b344b2b0a?auto=format&fit=crop&w=1600&q=80',
    alt: 'Soft gradient light on dark surface',
  },
} as const satisfies Record<string, MediaAsset>;

export type PageBackgroundKey = keyof typeof PAGE_BACKGROUNDS;

/** Homepage bento gallery — editorial stills */
export const SHOWCASE_GALLERY: MediaAsset[] = [
  {
    id: 'gallery-agents',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    alt: 'Humanoid robot in soft studio light',
  },
  {
    id: 'gallery-chain',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    alt: 'Ethereum blockchain visualization',
  },
  {
    id: 'gallery-network',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    alt: 'Server room with blue ambient light',
  },
  {
    id: 'gallery-mission',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Matrix-style code rain in green and blue',
  },
  {
    id: 'gallery-fund',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1642790106117-e829e1721406?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cryptocurrency tokens on dark surface',
  },
  {
    id: 'gallery-launch',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1457364554154-aa6e72bdb2b3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Notebook and pen in soft light',
  },
];

/** Fallback covers when campaigns have no image */
export const CAMPAIGN_COVER_POOL: MediaAsset[] = [
  {
    id: 'cover-1',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1535378917022-25bbc22c9cac?auto=format&fit=crop&w=800&q=80',
    alt: 'Glowing circuit pathways',
  },
  {
    id: 'cover-2',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c1f58b?auto=format&fit=crop&w=800&q=80',
    alt: 'Cybersecurity lock on digital grid',
  },
  {
    id: 'cover-3',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    alt: 'Analytics dashboard with charts',
  },
  {
    id: 'cover-4',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80',
    alt: 'Laptop with code on screen',
  },
  {
    id: 'cover-5',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    alt: 'Robot arm in manufacturing light',
  },
  {
    id: 'cover-6',
    kind: 'image',
    src: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
    alt: 'Mobile device with app interface',
  },
];

export function getCampaignCover(campaignId: string, avatarUrl?: string): MediaAsset {
  if (avatarUrl) {
    return {
      id: `avatar-${campaignId}`,
      kind: 'image',
      src: avatarUrl,
      alt: 'Campaign author',
    };
  }
  let hash = 0;
  for (let i = 0; i < campaignId.length; i++) {
    hash = (hash + campaignId.charCodeAt(i)) % CAMPAIGN_COVER_POOL.length;
  }
  return CAMPAIGN_COVER_POOL[hash] ?? CAMPAIGN_COVER_POOL[0];
}
