// API configuration
const API_BASE_URL = 'http://localhost:3000';

export type Platform = 'pinterest' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'facebook';

export interface PlatformStatus {
  connected: boolean;
  userId: string;
  platform: Platform;
  scopes?: string[];
  expiresAt?: string;
  platformUserId?: string;
  platformUsername?: string;
}

export interface TikTokUser {
  tiktokUserId: string;
  tiktokUsername: string | null;
  scopes: string[];
  expiresAt: string;
  createdAt: string;
  isExpired: boolean;
}

export interface TikTokUsersResponse {
  count: number;
  users: TikTokUser[];
}

export interface ApiError {
  error: string;
  message: string;
}

// Platform-specific endpoint configurations
const platformEndpoints: Record<Platform, { 
  base: string; 
  hasUserId: boolean;
  hasDisconnect: boolean;
}> = {
  pinterest: { base: '/auth/pinterest', hasUserId: true, hasDisconnect: true },
  tiktok: { base: '/api/auth/tiktok', hasUserId: false, hasDisconnect: false },
  instagram: { base: '/auth/instagram', hasUserId: true, hasDisconnect: true },
  twitter: { base: '/auth/twitter', hasUserId: true, hasDisconnect: true },
  linkedin: { base: '/auth/linkedin', hasUserId: true, hasDisconnect: true },
  youtube: { base: '/auth/youtube', hasUserId: true, hasDisconnect: true },
  facebook: { base: '/auth/facebook', hasUserId: true, hasDisconnect: true },
};

// Get platform OAuth login URL (redirects to platform)
export function getLoginUrl(platform: Platform, userId?: string): string {
  const config = platformEndpoints[platform];
  
  if (platform === 'tiktok') {
    // TikTok doesn't use userId in login
    return `${API_BASE_URL}${config.base}`;
  }
  
  return `${API_BASE_URL}${config.base}/login?userId=${encodeURIComponent(userId || '')}`;
}

// Check connection status for a platform
export async function getStatus(platform: Platform, userId: string): Promise<PlatformStatus> {
  const config = platformEndpoints[platform];
  
  const response = await fetch(
    `${API_BASE_URL}${config.base}/status?userId=${encodeURIComponent(userId)}`
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to get status');
  }
  
  return response.json();
}

// Get all TikTok authenticated users
export async function getTikTokUsers(): Promise<TikTokUsersResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/tiktok/users`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch TikTok users');
  }
  
  return response.json();
}

// Check TikTok user token status
export async function checkTikTokUser(tiktokUserId: string): Promise<{
  authenticated: boolean;
  tiktokUsername?: string;
  expiresAt?: string;
  isExpired?: boolean;
  needsRefresh?: boolean;
  message?: string;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/tiktok/check/${encodeURIComponent(tiktokUserId)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to check TikTok user');
  }
  
  return response.json();
}

// Disconnect a platform
export async function disconnect(platform: Platform, userId: string): Promise<void> {
  const config = platformEndpoints[platform];
  
  if (!config.hasDisconnect) {
    throw new Error(`${platform} does not support disconnect`);
  }
  
  const response = await fetch(
    `${API_BASE_URL}${config.base}/disconnect?userId=${encodeURIComponent(userId)}`
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to disconnect');
  }
}

// Platform display information
export const platformInfo: Record<Platform, { 
  name: string; 
  icon: string; 
  available: boolean;
  hasUserId: boolean;
  description?: string;
}> = {
  pinterest: { 
    name: 'Pinterest', 
    icon: 'pinterest', 
    available: true, 
    hasUserId: true,
    description: 'Connect with your user ID'
  },
  tiktok: { 
    name: 'TikTok', 
    icon: 'tiktok', 
    available: true, 
    hasUserId: false,
    description: 'Global authentication - no user ID needed'
  },
  instagram: { name: 'Instagram', icon: 'instagram', available: false, hasUserId: true },
  twitter: { name: 'X (Twitter)', icon: 'twitter', available: false, hasUserId: true },
  linkedin: { name: 'LinkedIn', icon: 'linkedin', available: false, hasUserId: true },
  youtube: { name: 'YouTube', icon: 'youtube', available: false, hasUserId: true },
  facebook: { name: 'Facebook', icon: 'facebook', available: false, hasUserId: true },
};
