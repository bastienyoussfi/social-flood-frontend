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

export interface ApiError {
  error: string;
  message: string;
}

// Get platform OAuth login URL (redirects to platform)
export function getLoginUrl(platform: Platform, userId: string): string {
  return `${API_BASE_URL}/auth/${platform}/login?userId=${encodeURIComponent(userId)}`;
}

// Check connection status for a platform
export async function getStatus(platform: Platform, userId: string): Promise<PlatformStatus> {
  const response = await fetch(
    `${API_BASE_URL}/auth/${platform}/status?userId=${encodeURIComponent(userId)}`
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to get status');
  }
  
  return response.json();
}

// Disconnect a platform
export async function disconnect(platform: Platform, userId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/auth/${platform}/disconnect?userId=${encodeURIComponent(userId)}`
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to disconnect');
  }
}

// Platform display information
export const platformInfo: Record<Platform, { name: string; icon: string; available: boolean }> = {
  pinterest: { name: 'Pinterest', icon: 'pinterest', available: true },
  instagram: { name: 'Instagram', icon: 'instagram', available: false },
  twitter: { name: 'X (Twitter)', icon: 'twitter', available: false },
  linkedin: { name: 'LinkedIn', icon: 'linkedin', available: false },
  tiktok: { name: 'TikTok', icon: 'tiktok', available: false },
  youtube: { name: 'YouTube', icon: 'youtube', available: false },
  facebook: { name: 'Facebook', icon: 'facebook', available: false },
};

