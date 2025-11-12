import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PostPackage } from '@/types/post';
import { PlatformPanel } from './PlatformPanel';
import { LinkedInEditor } from './LinkedInEditor';
import { TwitterEditor } from './TwitterEditor';
import { Button } from '@/components/ui/button';

export function PostComposer() {
  const { t } = useTranslation();

  // Initialize post package with both platforms enabled by default
  const [postPackage, setPostPackage] = useState<PostPackage>({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    status: 'draft',
    posts: {
      linkedin: {
        enabled: true,
        content: '',
        images: [],
      },
      twitter: {
        enabled: true,
        content: '',
        images: [],
      },
    },
  });

  // Handler for LinkedIn updates
  const updateLinkedInContent = (content: string) => {
    setPostPackage((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        linkedin: prev.posts.linkedin
          ? { ...prev.posts.linkedin, content }
          : { enabled: true, content, images: [] },
      },
    }));
  };

  const toggleLinkedIn = (enabled: boolean) => {
    setPostPackage((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        linkedin: prev.posts.linkedin ? { ...prev.posts.linkedin, enabled } : undefined,
      },
    }));
  };

  // Handler for Twitter updates
  const updateTwitterContent = (content: string) => {
    setPostPackage((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        twitter: prev.posts.twitter
          ? { ...prev.posts.twitter, content }
          : { enabled: true, content, images: [] },
      },
    }));
  };

  const toggleTwitter = (enabled: boolean) => {
    setPostPackage((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        twitter: prev.posts.twitter ? { ...prev.posts.twitter, enabled } : undefined,
      },
    }));
  };

  const handlePublish = () => {
    console.log('Publishing post package:', postPackage);
    // TODO: Implement publish logic
  };

  return (
    <div className="space-y-6">
      {/* Split-pane layout for LinkedIn and Twitter */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LinkedIn Panel */}
        {postPackage.posts.linkedin && (
          <PlatformPanel
            platform="linkedin"
            enabled={postPackage.posts.linkedin.enabled}
            onToggle={toggleLinkedIn}
          >
            <LinkedInEditor
              content={postPackage.posts.linkedin.content}
              onChange={updateLinkedInContent}
              disabled={!postPackage.posts.linkedin.enabled}
            />
          </PlatformPanel>
        )}

        {/* Twitter Panel */}
        {postPackage.posts.twitter && (
          <PlatformPanel
            platform="twitter"
            enabled={postPackage.posts.twitter.enabled}
            onToggle={toggleTwitter}
          >
            <TwitterEditor
              content={postPackage.posts.twitter.content}
              onChange={updateTwitterContent}
              disabled={!postPackage.posts.twitter.enabled}
            />
          </PlatformPanel>
        )}
      </div>

      {/* Publish Bar */}
      <div className="border-border sticky bottom-4 rounded-lg border bg-card p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={() => console.log('Clear all')}>
            {t('common.actions.clearAll')}
          </Button>
          <Button onClick={handlePublish} size="lg">
            {t('composer.publish.button')}
          </Button>
        </div>
      </div>
    </div>
  );
}
