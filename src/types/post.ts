/**
 * Core domain model for Social Flood post package system
 */

// Platform types
export type Platform = 'linkedin' | 'twitter';

// Post status types
export type PostStatus = 'pending' | 'posting' | 'success' | 'failed';

export type PackageStatus = 'draft' | 'posting' | 'success' | 'partial' | 'failed';

/**
 * LinkedIn post variant
 * Max content length: 3000 characters
 * Max images: 9
 */
export interface LinkedInPostVariant {
  enabled: boolean;
  content: string;
  images: string[]; // URLs
  status?: PostStatus;
  error?: string;
}

/**
 * Twitter post variant
 * Max content length: 280 characters
 * Max images: 4
 */
export interface TwitterPostVariant {
  enabled: boolean;
  content: string;
  images: string[]; // URLs
  status?: PostStatus;
  error?: string;
}

/**
 * Platform-specific post variants
 */
export interface PostVariants {
  linkedin?: LinkedInPostVariant;
  twitter?: TwitterPostVariant;
}

/**
 * Main PostPackage that orchestrates multiple platform-specific posts
 */
export interface PostPackage {
  id: string;
  createdAt: Date;
  status: PackageStatus;
  posts: PostVariants;
}

/**
 * Response from publishing a post to a platform
 */
export interface PostResponse {
  platform: Platform;
  success: boolean;
  postUrl?: string;
  error?: string;
}

/**
 * Validation result for post content
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Platform configuration
 */
export interface PlatformConfig {
  platform: Platform;
  nameKey: string; // Translation key for platform name
  maxChars: number;
  maxImages: number;
  color: string; // CSS variable name
}

/**
 * Character limit constants
 */
export const CHAR_LIMITS: Record<Platform, number> = {
  linkedin: 3000,
  twitter: 280,
};

/**
 * Image limit constants
 */
export const IMAGE_LIMITS: Record<Platform, number> = {
  linkedin: 9,
  twitter: 4,
};
