// API configuration
const API_BASE_URL = 'http://localhost:3000';

export type Platform = 'pinterest' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'facebook';

export interface OAuthToken {
  userId: string;
  platform: Platform;
  platformUserId: string;
  platformUsername?: string;
  scopes: string[];
  expiresAt: string;
  refreshExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStatus {
  connected: boolean;
  userId: string;
  platform: Platform;
  scopes?: string[];
  expiresAt?: string;
  platformUserId?: string;
  platformUsername?: string;
}

export interface PlatformUsersResponse {
  count: number;
  users: OAuthToken[];
}

export interface ApiError {
  error: string;
  message: string;
}

// Unified API endpoints - all platforms now follow the same pattern
// GET  /api/auth/{platform}/login?userId=xxx - Start OAuth
// GET  /api/auth/{platform}/callback - Handle callback  
// GET  /api/auth/{platform}/status?userId=xxx - Check status
// DELETE /api/auth/{platform}/:userId - Disconnect
// GET  /api/auth/{platform}/users - List all (admin)

// Get platform OAuth login URL
export function getLoginUrl(platform: Platform, userId: string): string {
  return `${API_BASE_URL}/api/auth/${platform}/login?userId=${encodeURIComponent(userId)}`;
}

// Check connection status for a platform
export async function getStatus(platform: Platform, userId: string): Promise<PlatformStatus> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/${platform}/status?userId=${encodeURIComponent(userId)}`
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to get status');
  }
  
  return response.json();
}

// Get all authenticated users for a platform (admin)
export async function getPlatformUsers(platform: Platform): Promise<PlatformUsersResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/${platform}/users`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${platform} users`);
  }
  
  return response.json();
}

// Disconnect a platform (revoke token)
export async function disconnect(platform: Platform, userId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/${platform}/${encodeURIComponent(userId)}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to disconnect');
  }
}

// Platform display information
export const platformInfo: Record<Platform, { 
  name: string; 
  available: boolean;
  description?: string;
}> = {
  pinterest: { 
    name: 'Pinterest', 
    available: true, 
    description: 'Share pins and boards'
  },
  tiktok: { 
    name: 'TikTok', 
    available: true, 
    description: 'Share short-form videos'
  },
  twitter: { 
    name: 'X (Twitter)', 
    available: true, 
    description: 'Share tweets and threads'
  },
  linkedin: { 
    name: 'LinkedIn', 
    available: true, 
    description: 'Share professional content'
  },
  instagram: { 
    name: 'Instagram', 
    available: false, 
    description: 'Coming soon'
  },
  youtube: { 
    name: 'YouTube', 
    available: true, 
    description: 'Upload videos to your channel'
  },
  facebook: { 
    name: 'Facebook', 
    available: false, 
    description: 'Coming soon'
  },
};

// Get all available platforms
export const availablePlatforms = Object.entries(platformInfo)
  .filter(([, info]) => info.available)
  .map(([platform]) => platform as Platform);

// Get coming soon platforms
export const comingSoonPlatforms = Object.entries(platformInfo)
  .filter(([, info]) => !info.available)
  .map(([platform]) => platform as Platform);
