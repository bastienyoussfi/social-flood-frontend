// API configuration
const API_BASE_URL = 'http://localhost:3000';

export type Platform = 'pinterest' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'facebook' | 'bluesky';

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
  bluesky: {
    name: 'Bluesky',
    available: true,
    description: 'Share on the decentralized social network'
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

// ==================== POSTING API ====================

// Twitter Post Request (280 char limit, max 4 images)
export interface TwitterPostRequest {
  text: string;
  images?: string[]; // Base64 or URLs
}

// LinkedIn Post Request (3000 char limit, article support)
export interface LinkedInPostRequest {
  text: string;
  articleUrl?: string;
  articleTitle?: string;
}

// Bluesky Post Request (300 char limit, link cards)
export interface BlueskyPostRequest {
  text: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
}

// TikTok Post Request (video required, privacy settings)
export interface TikTokPostRequest {
  videoUrl: string;
  caption?: string;
  privacyLevel?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  allowComments?: boolean;
  allowDuet?: boolean;
  allowStitch?: boolean;
}

// Pinterest Post Request (image + boardId required)
export interface PinterestPostRequest {
  boardId: string;
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
}

// Instagram Post Request (media required, 1-10 items)
export interface InstagramPostRequest {
  userId: string;
  mediaUrls: string[]; // 1-10 images/videos
  caption?: string;
  location?: string;
}

export interface PostResponse {
  success: boolean;
  postId?: string;
  platformPostId?: string;
  message: string;
}

// Helper for posting with FormData (for file uploads)
const fetchWithAuthMultipart = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include',
  });
};

// Post to Twitter
export async function postToTwitter(data: TwitterPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/twitter/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to Twitter');
  }

  return response.json();
}

// Post to LinkedIn
export async function postToLinkedIn(data: LinkedInPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/linkedin/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to LinkedIn');
  }

  return response.json();
}

// Post to Bluesky
export async function postToBluesky(data: BlueskyPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/bluesky/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to Bluesky');
  }

  return response.json();
}

// Post to TikTok
export async function postToTikTok(data: TikTokPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/tiktok/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to TikTok');
  }

  return response.json();
}

// Post to Pinterest
export async function postToPinterest(data: PinterestPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/pinterest/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to Pinterest');
  }

  return response.json();
}

// Post to Instagram
export async function postToInstagram(data: InstagramPostRequest): Promise<PostResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/api/platforms/instagram/posts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message || 'Failed to post to Instagram');
  }

  return response.json();
}
