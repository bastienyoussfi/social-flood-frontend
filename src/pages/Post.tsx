import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/PlatformIcon';
import { TwitterPostForm } from '@/components/forms/TwitterPostForm';
import { LinkedInPostForm } from '@/components/forms/LinkedInPostForm';
import { BlueskyPostForm } from '@/components/forms/BlueskyPostForm';
import { TikTokPostForm } from '@/components/forms/TikTokPostForm';
import { PinterestPostForm } from '@/components/forms/PinterestPostForm';
import { InstagramPostForm } from '@/components/forms/InstagramPostForm';
import { getConnections, type SocialConnection, type Platform, platformInfo } from '@/lib/api';
import { ArrowLeft, Zap, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | null;

interface Toast {
  type: ToastType;
  message: string;
}

export function Post() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await getConnections();
        const activeConnections = data.filter((c) => c.isActive);
        setConnections(activeConnections);
        if (activeConnections.length > 0) {
          setSelectedPlatform(activeConnections[0].platform);
        }
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Failed to load connections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSuccess = (message: string) => {
    showToast('success', message);
  };

  const handleError = (error: string) => {
    showToast('error', error);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-screen p-6 md:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card className="border-warning/20 bg-warning/10">
            <CardContent className="p-12 text-center">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-warning" />
              <h2 className="mb-2 text-xl font-semibold">No Platforms Connected</h2>
              <p className="mb-6 text-muted-foreground">
                You need to connect at least one platform before you can post.
              </p>
              <Link to="/">
                <Button>
                  <Zap className="mr-2 h-4 w-4" />
                  Connect Platforms
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create Post</h1>
          </div>
          <Badge variant="secondary">{connections.length} connected</Badge>
        </div>

        {/* Platform Tabs */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-wrap gap-2">
              {connections.map((connection) => (
                <button
                  key={connection.id}
                  onClick={() => setSelectedPlatform(connection.platform)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all',
                    selectedPlatform === connection.platform
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  )}
                >
                  <PlatformIcon platform={connection.platform} className="h-5 w-5" />
                  <span className="font-medium">{platformInfo[connection.platform].name}</span>
                </button>
              ))}
            </div>

            {/* Platform Forms */}
            <div className="animate-in fade-in">
              {selectedPlatform === 'twitter' && (
                <TwitterPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
              {selectedPlatform === 'linkedin' && (
                <LinkedInPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
              {selectedPlatform === 'bluesky' && (
                <BlueskyPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
              {selectedPlatform === 'tiktok' && (
                <TikTokPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
              {selectedPlatform === 'pinterest' && (
                <PinterestPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
              {selectedPlatform === 'instagram' && (
                <InstagramPostForm onSuccess={handleSuccess} onError={handleError} />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Toast Notification */}
        {toast && (
          <div
            className={cn(
              'fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 rounded-lg border-2 p-4 shadow-lg',
              toast.type === 'success'
                ? 'border-success/20 bg-success/10 text-success'
                : 'border-destructive/20 bg-destructive/10 text-destructive'
            )}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
