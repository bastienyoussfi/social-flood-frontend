// API configuration
const API_BASE_URL = 'http://localhost:3000';

export type Platform = 'pinterest' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'facebook';

// Social connection from the new connections API
export interface SocialConnection {
  id: string;
  userId: string;
  platform: Platform;
  displayName: string;
  platformUserId: string;
  platformUsername?: string;
  scopes: string[];
  expiresAt: string;
  refreshExpiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionsResponse {
  connections: SocialConnection[];
}

export interface ApiError {
  error: string;
  message: string;
}

// Helper to get auth headers (cookies are sent automatically with credentials: 'include')
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

// Get all connections for the authenticated user
export async function getConnections(): Promise<SocialConnection[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/connections`);
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to get connections');
  }
  
  const data: ConnectionsResponse = await response.json();
  return data.connections;
}

// Get connection URL for a platform (redirects to OAuth flow)
export function getConnectUrl(platform: Platform): string {
  return `${API_BASE_URL}/api/connections/${platform}/connect`;
}

// Disconnect a platform by connection ID
export async function disconnectPlatform(connectionId: string): Promise<void> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/connections/${connectionId}`,
    { method: 'DELETE' }
  );
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to disconnect');
  }
}

// Refresh a connection's token
export async function refreshConnection(connectionId: string): Promise<SocialConnection> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/connections/${connectionId}/refresh`,
    { method: 'POST' }
  );
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to refresh connection');
  }
  
  return response.json();
}

// Get connection details
export async function getConnectionDetails(connectionId: string): Promise<SocialConnection> {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/api/connections/details/${connectionId}`
  );
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to get connection details');
  }
  
  return response.json();
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
    available: true, 
    description: 'Share photos and reels'
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
