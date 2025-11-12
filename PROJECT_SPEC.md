# Social Flood - Project Specification

## Vision

A modern social media management platform that allows users to create unified "Post Packages" - coordinated content that publishes different variations across multiple platforms simultaneously. Built to scale from a POC to a full-featured product with analytics, AI generation, video support, and scheduling.

---

## Core Concept

### The "Post Package" Model

A **Post Package** is the fundamental unit of work:
- One unified piece of content (e.g., "Q4 Product Launch")
- Multiple platform-specific variations (e.g., LinkedIn article + Twitter thread + TikTok video)
- All variations publish atomically at the same time
- Each platform has its own constraints, format, and requirements

**Example Post Package:**
```
Package: "New Blog Post Announcement"
├── LinkedIn: Full article (2000 words) with images
├── Twitter: Short tweet thread (280 chars each) with link
├── Medium: Full article repost
└── Instagram: Carousel of key points with graphics
```

---

## Design Philosophy

### Visual Identity

**Modern, Clean, Animated**
- Minimalist interface with focus on content
- Smooth, delightful micro-interactions
- Professional yet friendly
- Focus on visual hierarchy and breathing room

### Design System

**Foundation:**
- shadcn/ui components as building blocks
- Tailwind CSS v4 for styling
- CSS variables for theming
- OKLCH color space for consistency

**Theme System:**
```css
/* Easily customizable via CSS variables */
@theme {
  --color-primary: oklch(0.6 0.2 250);     /* Brand color */
  --color-secondary: oklch(0.7 0.15 280);
  --color-accent: oklch(0.65 0.25 150);

  /* Semantic colors */
  --color-success: oklch(0.7 0.2 140);
  --color-warning: oklch(0.75 0.2 60);
  --color-error: oklch(0.6 0.25 20);

  /* Surfaces */
  --color-background: oklch(1 0 0);
  --color-card: oklch(0.98 0 0);
  --color-foreground: oklch(0.2 0 0);

  /* Dark mode */
  @media (prefers-color-scheme: dark) {
    --color-background: oklch(0.15 0 0);
    --color-card: oklch(0.18 0 0);
    --color-foreground: oklch(0.95 0 0);
  }
}
```

### Animation Principles

**Micro-interactions:**
- Hover states with subtle scale/color transitions
- Card elevation changes on interaction
- Loading states with skeleton screens
- Success/error states with smooth color transitions
- Character counts with color transitions (green → yellow → red)

**Page transitions:**
- Smooth fade/slide between views
- Staggered list animations (platform cards)
- Progressive loading (content → then decorations)

**Motion tokens:**
```typescript
// Consistent timing functions
export const motion = {
  duration: {
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};
```

### Key UI Patterns

**Platform Cards:**
- Each platform post gets its own card
- Real-time validation indicators
- Character count with color feedback
- Live preview toggle
- Drag-to-reorder

**Publishing Progress:**
- Animated progress bar
- Per-platform status indicators
- Smooth transitions between states (idle → publishing → success/failed)
- Celebration animation on success

**Media Handling:**
- Drag-and-drop upload zones
- Thumbnail previews with hover overlays
- Video playback controls
- Crop/edit tools with live preview

---

## Architecture

### Domain-Driven Design

Organize by business domains, not technical layers:

```
src/
├── domains/
│   ├── content/              # Content creation & management
│   ├── publishing/           # Publishing logic & platform APIs
│   ├── media/                # Media processing & storage
│   ├── generation/           # AI content generation (future)
│   ├── analytics/            # Metrics & insights (future)
│   └── scheduling/           # Scheduled posting (future)
├── shared/                   # Cross-domain utilities
│   ├── api/
│   ├── events/
│   └── utils/
├── components/               # Shared UI components
│   └── ui/                   # shadcn components
└── app/                      # Application layer (pages, routing)
```

### Why Domains?

✅ **Extensibility:** Add new platforms without touching existing code
✅ **Testability:** Each domain has clear boundaries
✅ **Team Scaling:** Different teams can own different domains
✅ **Feature Independence:** Analytics doesn't affect content creation
✅ **Future-Proof:** Easy to add scheduling, AI, video, etc.

---

## Core Data Models

### PostPackage

```typescript
interface PostPackage {
  id: string;
  name: string;                    // "Q4 Product Launch"
  createdAt: Date;
  updatedAt: Date;

  platformPosts: PlatformPost[];

  status: 'draft' | 'publishing' | 'posted' | 'failed' | 'partial';

  publishedAt?: Date;

  metadata?: {
    generatedBy?: 'manual' | 'ai' | 'template';
    generationPrompt?: string;
    tags?: string[];
  };
}
```

### PlatformPost

```typescript
enum SocialPlatform {
  Twitter = 'twitter',
  LinkedIn = 'linkedin',
  Medium = 'medium',
  TikTok = 'tiktok',
  Instagram = 'instagram',
  Facebook = 'facebook',
}

enum PostFormat {
  ShortForm = 'short_form',        // Twitter, Instagram caption
  Article = 'article',              // LinkedIn article, Medium
  Video = 'video',                  // TikTok, Instagram Reels, YouTube Shorts
  ImagePost = 'image_post',         // Instagram, Facebook
  TextPost = 'text_post',           // LinkedIn post, Facebook
}

interface PlatformPost {
  id: string;
  platform: SocialPlatform;
  format: PostFormat;

  content: {
    title?: string;                 // For articles
    body: string;                   // Main text content
    hashtags?: string[];
    mentions?: string[];
    media?: MediaAsset[];
  };

  validation: {
    isValid: boolean;
    errors: string[];               // Translation keys
    warnings: string[];
  };

  publishResult?: {
    platformPostId: string;         // ID on the platform
    url: string;                    // Public URL
    publishedAt: Date;
  };
}
```

### MediaAsset

```typescript
enum MediaType {
  Image = 'image',
  Video = 'video',
  Carousel = 'carousel',
  Document = 'document',
}

interface MediaAsset {
  id: string;
  type: MediaType;
  originalUrl: string;

  metadata: {
    duration?: number;              // Videos (seconds)
    dimensions: {
      width: number;
      height: number;
    };
    size: number;                   // Bytes
    format: string;                 // 'mp4', 'mov', 'jpg', 'png'
    aspectRatio: number;            // e.g., 0.5625 for 9:16
  };

  // Platform-specific variants (transcoded videos, cropped images)
  variants: {
    thumbnail?: string;
    compressed?: string;
    platformSpecific: Record<SocialPlatform, {
      url: string;
      format: string;
      meetsRequirements: boolean;
    }>;
  };

  processing: {
    status: 'pending' | 'processing' | 'ready' | 'failed';
    progress?: number;              // 0-100
    error?: string;
  };

  // Video-specific metadata
  videoMetadata?: {
    thumbnailTimestamp: number;     // Second to use as thumbnail
    subtitles?: {
      language: string;
      url: string;
    }[];
    hasAudio: boolean;
  };
}
```

---

## Platform Service Architecture

### The Interface

All platform integrations implement this interface:

```typescript
// domains/publishing/services/platforms/IPlatformService.ts

export interface PlatformCapabilities {
  supportedMediaTypes: MediaType[];
  supportedFormats: PostFormat[];

  constraints: {
    text?: {
      minLength?: number;
      maxLength: number;
      supportsMarkdown?: boolean;
      supportsHtml?: boolean;
    };
    media?: {
      maxImages?: number;
      maxVideos?: number;
      maxDuration?: number;           // seconds
      supportedAspectRatios: string[]; // ['16:9', '9:16', '1:1']
      maxFileSize: number;             // bytes
    };
    hashtags?: {
      max: number;
      inlineAllowed: boolean;
    };
  };

  features: {
    supportsScheduling: boolean;
    supportsAnalytics: boolean;
    supportsThreads: boolean;
    supportsPolls: boolean;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];                 // Translation keys
  warnings: string[];
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;          // ID on the platform
  url?: string;                     // Public URL of the post
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface IPlatformService {
  readonly platform: SocialPlatform;

  // Core operations
  getCapabilities(): PlatformCapabilities;
  validate(post: PlatformPost): ValidationResult;
  publish(post: PlatformPost, auth: PlatformAuth): Promise<PublishResult>;

  // Analytics (future)
  fetchAnalytics?(platformPostId: string, auth: PlatformAuth): Promise<PlatformAnalytics>;

  // Connection management
  testConnection(auth: PlatformAuth): Promise<boolean>;

  // Media preprocessing (optional)
  prepareMedia?(asset: MediaAsset): Promise<MediaAsset>;
}
```

### Platform Registry

Dynamically register and access platform services:

```typescript
// domains/publishing/services/PlatformRegistry.ts

class PlatformRegistry {
  private services = new Map<SocialPlatform, IPlatformService>();

  register(service: IPlatformService) {
    this.services.set(service.platform, service);
  }

  get(platform: SocialPlatform): IPlatformService {
    const service = this.services.get(platform);
    if (!service) {
      throw new Error(`Platform ${platform} not registered`);
    }
    return service;
  }

  getAllPlatforms(): SocialPlatform[] {
    return Array.from(this.services.keys());
  }

  getCapabilities(platform: SocialPlatform): PlatformCapabilities {
    return this.get(platform).getCapabilities();
  }
}

// Export singleton
export const platformRegistry = new PlatformRegistry();
```

### Example Implementation: Twitter

```typescript
// domains/publishing/services/platforms/TwitterService.ts

export class TwitterService implements IPlatformService {
  readonly platform = SocialPlatform.Twitter;

  getCapabilities(): PlatformCapabilities {
    return {
      supportedMediaTypes: [MediaType.Image, MediaType.Video],
      supportedFormats: [PostFormat.ShortForm],
      constraints: {
        text: {
          maxLength: 280,
          supportsMarkdown: false,
        },
        media: {
          maxImages: 4,
          maxVideos: 1,
          maxDuration: 140,             // 2min 20sec
          supportedAspectRatios: ['16:9', '1:1'],
          maxFileSize: 512_000_000,     // 512MB for video
        },
        hashtags: {
          max: 10,
          inlineAllowed: true,
        },
      },
      features: {
        supportsScheduling: true,
        supportsAnalytics: true,
        supportsThreads: true,
        supportsPolls: true,
      },
    };
  }

  validate(post: PlatformPost): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const capabilities = this.getCapabilities();

    // Check text length
    if (post.content.body.length > capabilities.constraints.text!.maxLength) {
      errors.push('validation.twitter.textTooLong');
    }

    // Check media count
    const imageCount = post.content.media?.filter(m => m.type === MediaType.Image).length || 0;
    const videoCount = post.content.media?.filter(m => m.type === MediaType.Video).length || 0;

    if (imageCount > capabilities.constraints.media!.maxImages!) {
      errors.push('validation.twitter.tooManyImages');
    }

    if (videoCount > 1) {
      errors.push('validation.twitter.tooManyVideos');
    }

    if (imageCount > 0 && videoCount > 0) {
      errors.push('validation.twitter.cannotMixImageAndVideo');
    }

    // Warnings
    if (post.content.hashtags && post.content.hashtags.length > 3) {
      warnings.push('validation.twitter.tooManyHashtags');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async publish(post: PlatformPost, auth: PlatformAuth): Promise<PublishResult> {
    try {
      // Twitter API v2 call
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: post.content.body,
          // media_ids, etc.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.errors?.[0]?.code || 'UNKNOWN_ERROR',
            message: data.errors?.[0]?.message || 'Failed to publish',
            retryable: response.status >= 500,
          },
        };
      }

      return {
        success: true,
        platformPostId: data.data.id,
        url: `https://twitter.com/${auth.username}/status/${data.data.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message,
          retryable: true,
        },
      };
    }
  }

  async testConnection(auth: PlatformAuth): Promise<boolean> {
    try {
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: { 'Authorization': `Bearer ${auth.accessToken}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### Example Implementation: LinkedIn

```typescript
// domains/publishing/services/platforms/LinkedInService.ts

export class LinkedInService implements IPlatformService {
  readonly platform = SocialPlatform.LinkedIn;

  getCapabilities(): PlatformCapabilities {
    return {
      supportedMediaTypes: [MediaType.Image, MediaType.Video, MediaType.Document],
      supportedFormats: [PostFormat.Article, PostFormat.TextPost],
      constraints: {
        text: {
          maxLength: 3000,
          supportsMarkdown: false,
        },
        media: {
          maxImages: 9,
          maxVideos: 1,
          maxDuration: 600,             // 10 minutes
          supportedAspectRatios: ['16:9', '1:1', '4:5'],
          maxFileSize: 5_000_000_000,   // 5GB for video
        },
        hashtags: {
          max: 30,
          inlineAllowed: true,
        },
      },
      features: {
        supportsScheduling: true,
        supportsAnalytics: true,
        supportsThreads: false,
        supportsPolls: true,
      },
    };
  }

  validate(post: PlatformPost): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const capabilities = this.getCapabilities();

    // Check text length
    if (post.content.body.length > capabilities.constraints.text!.maxLength) {
      errors.push('validation.linkedin.textTooLong');
    }

    // Check if article has title
    if (post.format === PostFormat.Article && !post.content.title) {
      errors.push('validation.linkedin.articleRequiresTitle');
    }

    // Media validations
    const mediaCount = post.content.media?.length || 0;
    if (mediaCount > capabilities.constraints.media!.maxImages!) {
      errors.push('validation.linkedin.tooManyMedia');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async publish(post: PlatformPost, auth: PlatformAuth): Promise<PublishResult> {
    try {
      // LinkedIn API call depends on format
      let endpoint = '';
      let payload = {};

      if (post.format === PostFormat.Article) {
        endpoint = 'https://api.linkedin.com/v2/ugcPosts';
        payload = {
          author: `urn:li:person:${auth.userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.content.body,
              },
              shareMediaCategory: 'ARTICLE',
              // ... article-specific fields
            },
          },
        };
      } else {
        // Regular post
        endpoint = 'https://api.linkedin.com/v2/ugcPosts';
        payload = {
          author: `urn:li:person:${auth.userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.content.body,
              },
              shareMediaCategory: 'NONE',
            },
          },
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'UNKNOWN_ERROR',
            message: data.message || 'Failed to publish',
            retryable: response.status >= 500,
          },
        };
      }

      const postId = data.id.split(':').pop();

      return {
        success: true,
        platformPostId: postId,
        url: `https://www.linkedin.com/feed/update/${data.id}`,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message,
          retryable: true,
        },
      };
    }
  }

  async testConnection(auth: PlatformAuth): Promise<boolean> {
    try {
      const response = await fetch('https://api.linkedin.com/v2/me', {
        headers: {
          'Authorization': `Bearer ${auth.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

---

## Event-Driven Architecture

For async operations and loose coupling between domains:

```typescript
// shared/events/EventBus.ts

export enum AppEvent {
  // Content events
  PACKAGE_CREATED = 'package:created',
  PACKAGE_UPDATED = 'package:updated',
  PACKAGE_DELETED = 'package:deleted',

  // Publishing events
  PUBLISHING_STARTED = 'publishing:started',
  PLATFORM_PUBLISHING = 'publishing:platform:started',
  PLATFORM_PUBLISHED = 'publishing:platform:completed',
  PLATFORM_FAILED = 'publishing:platform:failed',
  PUBLISHING_COMPLETED = 'publishing:completed',

  // Media events
  MEDIA_UPLOADED = 'media:uploaded',
  MEDIA_PROCESSING = 'media:processing',
  MEDIA_READY = 'media:ready',
  MEDIA_FAILED = 'media:failed',

  // Analytics events (future)
  ANALYTICS_FETCHED = 'analytics:fetched',
  ANALYTICS_UPDATED = 'analytics:updated',
}

export class EventBus {
  private listeners = new Map<AppEvent, Set<(payload: any) => void>>();

  on<T>(event: AppEvent, callback: (payload: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit<T>(event: AppEvent, payload: T) {
    this.listeners.get(event)?.forEach(callback => callback(payload));
  }
}

export const eventBus = new EventBus();
```

**Usage Example:**

```typescript
// Publishing service emits events
eventBus.emit(AppEvent.PLATFORM_PUBLISHED, {
  platform: SocialPlatform.Twitter,
  platformPostId: 'abc123',
  url: 'https://twitter.com/...',
});

// UI listens for events to update state
useEffect(() => {
  const unsubscribe = eventBus.on<PublishResult>(
    AppEvent.PLATFORM_PUBLISHED,
    (result) => {
      // Update UI, show success message
      toast.success(`Posted to ${result.platform}`);
    }
  );

  return unsubscribe;
}, []);
```

---

## State Management

### Content Domain: PostPackageContext

```typescript
// domains/content/context/PostPackageContext.tsx

type PostPackageAction =
  | { type: 'SET_PACKAGE_NAME'; name: string }
  | { type: 'ADD_PLATFORM'; platform: SocialPlatform }
  | { type: 'REMOVE_PLATFORM'; platformPostId: string }
  | { type: 'UPDATE_POST_CONTENT'; platformPostId: string; content: Partial<PlatformPost['content']> }
  | { type: 'UPDATE_POST_VALIDATION'; platformPostId: string; validation: ValidationResult }
  | { type: 'SET_STATUS'; status: PostPackage['status'] }
  | { type: 'LOAD_PACKAGE'; package: PostPackage };

function postPackageReducer(
  state: PostPackage,
  action: PostPackageAction
): PostPackage {
  switch (action.type) {
    case 'SET_PACKAGE_NAME':
      return { ...state, name: action.name };

    case 'ADD_PLATFORM':
      return {
        ...state,
        platformPosts: [
          ...state.platformPosts,
          createEmptyPlatformPost(action.platform),
        ],
      };

    case 'REMOVE_PLATFORM':
      return {
        ...state,
        platformPosts: state.platformPosts.filter(
          p => p.id !== action.platformPostId
        ),
      };

    case 'UPDATE_POST_CONTENT':
      return {
        ...state,
        platformPosts: state.platformPosts.map(post =>
          post.id === action.platformPostId
            ? {
                ...post,
                content: { ...post.content, ...action.content },
              }
            : post
        ),
      };

    case 'UPDATE_POST_VALIDATION':
      return {
        ...state,
        platformPosts: state.platformPosts.map(post =>
          post.id === action.platformPostId
            ? { ...post, validation: action.validation }
            : post
        ),
      };

    case 'SET_STATUS':
      return { ...state, status: action.status };

    case 'LOAD_PACKAGE':
      return action.package;

    default:
      return state;
  }
}
```

---

## Key UI Components

### PostPackageEditor (Main View)

```typescript
// domains/content/components/PostPackageEditor.tsx

export function PostPackageEditor() {
  const { package, dispatch } = usePostPackage();
  const { publish, status } = usePublisher();

  const isValid = package.platformPosts.every(p => p.validation.isValid);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with package name */}
      <PackageHeader
        name={package.name}
        status={package.status}
        onNameChange={(name) => dispatch({ type: 'SET_PACKAGE_NAME', name })}
      />

      {/* Platform selector */}
      <PlatformSelector
        availablePlatforms={platformRegistry.getAllPlatforms()}
        selectedPlatforms={package.platformPosts.map(p => p.platform)}
        onAddPlatform={(platform) => dispatch({ type: 'ADD_PLATFORM', platform })}
      />

      {/* Platform post cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {package.platformPosts.map((post) => (
          <PlatformPostCard
            key={post.id}
            post={post}
            onUpdate={(content) => dispatch({
              type: 'UPDATE_POST_CONTENT',
              platformPostId: post.id,
              content,
            })}
            onRemove={() => dispatch({
              type: 'REMOVE_PLATFORM',
              platformPostId: post.id,
            })}
          />
        ))}
      </div>

      {/* Publish button */}
      <PublishButton
        disabled={!isValid || status.state === 'publishing'}
        isPublishing={status.state === 'publishing'}
        onPublish={() => publish(package)}
      />

      {/* Publishing status */}
      {status.state !== 'idle' && (
        <PublishingStatus status={status} />
      )}
    </div>
  );
}
```

### PlatformPostCard

```typescript
// domains/content/components/PlatformPostCard.tsx

interface PlatformPostCardProps {
  post: PlatformPost;
  onUpdate: (content: Partial<PlatformPost['content']>) => void;
  onRemove: () => void;
}

export function PlatformPostCard({ post, onUpdate, onRemove }: PlatformPostCardProps) {
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);
  const capabilities = platformRegistry.getCapabilities(post.platform);

  return (
    <Card className="transition-all hover:shadow-lg">
      <Card.Header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={post.platform} />
          <span className="font-semibold">
            {t(`platforms.${post.platform}.name`)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <Edit2 /> : <Eye />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
          >
            <X />
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {showPreview ? (
          <PlatformPreview post={post} />
        ) : (
          <PlatformEditor
            post={post}
            capabilities={capabilities}
            onUpdate={onUpdate}
          />
        )}

        {/* Validation feedback */}
        <ValidationFeedback validation={post.validation} />
      </Card.Body>
    </Card>
  );
}
```

### Platform-Specific Editors

Each platform has its own editor that understands constraints:

```typescript
// domains/content/components/platform-editors/TwitterEditor.tsx

export function TwitterEditor({ post, capabilities, onUpdate }: EditorProps) {
  const { t } = useTranslation();
  const maxLength = capabilities.constraints.text!.maxLength;
  const remaining = maxLength - post.content.body.length;

  return (
    <div className="space-y-4">
      <Textarea
        value={post.content.body}
        onChange={(e) => onUpdate({ body: e.target.value })}
        placeholder={t('editors.twitter.placeholder')}
        className={cn(
          'min-h-[120px] resize-none',
          remaining < 0 && 'border-error'
        )}
      />

      <div className="flex items-center justify-between text-sm">
        <CharacterCount
          current={post.content.body.length}
          max={maxLength}
        />

        <HashtagInput
          hashtags={post.content.hashtags || []}
          max={capabilities.constraints.hashtags!.max}
          onChange={(hashtags) => onUpdate({ hashtags })}
        />
      </div>

      <MediaUploader
        media={post.content.media || []}
        maxCount={capabilities.constraints.media!.maxImages!}
        supportedTypes={capabilities.supportedMediaTypes}
        onUpload={(media) => onUpdate({ media })}
      />
    </div>
  );
}
```

---

## Future Domains

### Analytics Domain

```typescript
// domains/analytics/models/Analytics.ts

export interface PlatformAnalytics {
  platformPostId: string;
  platform: SocialPlatform;

  metrics: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
    saves?: number;
    clicks?: number;
    watchTime?: number;            // Videos: avg watch time
    completionRate?: number;       // Videos: % who finished
    engagementRate: number;
  };

  demographics?: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Record<string, number>;
  };

  fetchedAt: Date;
}

export interface PackageAnalytics {
  packageId: string;
  platformAnalytics: PlatformAnalytics[];

  aggregated: {
    totalViews: number;
    totalEngagement: number;
    bestPerformingPlatform: SocialPlatform;
    avgEngagementRate: number;
  };
}
```

### Generation Domain

```typescript
// domains/generation/models/Template.ts

export interface GenerationRequest {
  prompt: string;
  targetPlatforms: SocialPlatform[];
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
}

export class AIGenerationService {
  async generateContent(request: GenerationRequest): Promise<PostPackage> {
    // Call AI API
    // Parse response
    // Return PostPackage with platformPosts
  }

  async improveContent(post: PlatformPost, instruction: string): Promise<PlatformPost> {
    // "Make this more professional"
    // "Add emojis"
    // "Shorten to fit Twitter"
  }
}
```

### Scheduling Domain

```typescript
// domains/scheduling/models/ScheduledPost.ts

export interface ScheduledPost {
  id: string;
  packageId: string;
  scheduledFor: Date;
  timezone: string;
  status: 'pending' | 'posted' | 'failed';

  // Recurring options (future)
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
}
```

---

## Implementation Phases

### Phase 1: Foundation (POC) - 4-5 days

**Goal:** Basic post package creation and publishing to Twitter + LinkedIn

**Deliverables:**
- Domain structure set up
- Core data models
- Platform service interface + registry
- Twitter and LinkedIn services (basic)
- PostPackageEditor UI
- Platform cards with editors
- Basic validation
- Publishing flow
- Design system foundation

**Out of scope:**
- Media upload
- Analytics
- AI generation
- Scheduling

---

### Phase 2: Media Support - 3-4 days

**Deliverables:**
- Media domain
- Image upload and preview
- Video upload
- Platform-specific media constraints
- Media library
- Drag-and-drop upload

---

### Phase 3: Enhanced Publishing - 2-3 days

**Deliverables:**
- Retry logic for failed posts
- Better error handling
- Publishing progress UI
- Post history / drafts
- Save/load packages

---

### Phase 4: Analytics - 4-5 days

**Deliverables:**
- Analytics domain
- Fetch metrics from platforms
- Analytics dashboard
- Charts and visualizations
- Platform comparison

---

### Phase 5: AI Generation - 5-6 days

**Deliverables:**
- Generation domain
- AI service integration
- Prompt builder UI
- Content improvement tools
- Template system

---

### Phase 6: Additional Platforms - 2-3 days per platform

**Platforms to add:**
- Medium
- TikTok
- Instagram
- Facebook
- YouTube

---

### Phase 7: Scheduling - 4-5 days

**Deliverables:**
- Scheduling domain
- Calendar UI
- Timezone support
- Recurring posts

---

## Technical Stack

### Frontend
- **Framework:** Vite + React 18+
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **State Management:** React Context API + useReducer
- **i18n:** react-i18next
- **Routing:** React Router v6
- **Forms:** React Hook Form (future)
- **API Client:** Fetch API (+ potential wrapper)

### Development
- **Linting:** ESLint
- **Formatting:** Prettier
- **Type Checking:** TypeScript
- **Git:** Conventional commits

---

## Non-Functional Requirements

### Performance
- Initial page load: < 2s
- Time to interactive: < 3s
- Smooth animations (60fps)
- Lazy load routes and heavy components

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels (all translated)

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- No IE11 support

### Mobile
- Responsive design (mobile-first)
- Touch-friendly targets (min 44x44px)
- Mobile-optimized animations

---

## Open Questions / Decisions Needed

1. **Backend:**
   - REST API or GraphQL?
   - Real-time updates (WebSockets)?
   - Where is media stored? (S3, Cloudinary, etc.)

2. **Authentication:**
   - OAuth flow for each platform
   - How to store platform credentials securely?
   - Multi-user support from day 1?

3. **Media Processing:**
   - Client-side or server-side?
   - Video transcoding service?
   - Image optimization?

4. **Deployment:**
   - Vercel, Netlify, or custom?
   - Environment variables management?
   - CI/CD pipeline?

5. **Monitoring:**
   - Error tracking (Sentry)?
   - Analytics (PostHog, Mixpanel)?
   - Performance monitoring?

---

## Success Metrics

### POC Success
- [ ] Can create a post package
- [ ] Can add Twitter and LinkedIn posts
- [ ] Can edit content for each platform
- [ ] Validates against platform constraints
- [ ] Successfully publishes to both platforms
- [ ] Shows publishing progress
- [ ] Handles errors gracefully

### Product Success (Future)
- Time saved per post (vs manual posting)
- Number of platforms supported
- Post engagement rates
- User retention
- Feature adoption rates

---

## Next Steps

1. **Review and refine this spec**
2. **Finalize open questions** (backend, auth, media)
3. **Set up project structure**
4. **Implement Phase 1 (POC)**
5. **User testing and iteration**
6. **Plan Phase 2+**

---

**Last Updated:** 2025-11-12
**Version:** 1.0 (Draft)
