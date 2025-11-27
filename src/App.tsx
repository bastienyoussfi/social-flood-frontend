import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlatformCard } from '@/components/PlatformCard';
import { TikTokCard } from '@/components/TikTokCard';
import { type Platform, platformInfo, getStatus } from '@/lib/api';
import { Zap, RefreshCw, User, Loader2, Server, CheckCircle2 } from 'lucide-react';

// Platforms that use the standard userId-based flow
const USER_ID_PLATFORMS: Platform[] = ['pinterest', 'instagram', 'twitter', 'linkedin', 'youtube', 'facebook'];

// Platforms with custom UI (like TikTok)
const CUSTOM_PLATFORMS: Platform[] = ['tiktok'];

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || '');
  const [savedUserId, setSavedUserId] = useState(() => localStorage.getItem('userId') || '');
  const [connectedCount, setConnectedCount] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Save userId to localStorage
  const handleSaveUserId = () => {
    localStorage.setItem('userId', userId);
    setSavedUserId(userId);
    setRefreshKey(prev => prev + 1);
  };

  // Check connection status for userId-based platforms
  const checkAllStatuses = async () => {
    if (!savedUserId) return;
    
    setCheckingStatus(true);
    let count = 0;

    const availablePlatforms = USER_ID_PLATFORMS.filter(p => platformInfo[p].available);
    
    await Promise.all(
      availablePlatforms.map(async (platform) => {
        try {
          const status = await getStatus(platform, savedUserId);
          if (status.connected) count++;
        } catch {
          // Ignore errors
        }
      })
    );

    setConnectedCount(count);
    setCheckingStatus(false);
  };

  useEffect(() => {
    if (savedUserId) {
      checkAllStatuses();
    }
  }, [savedUserId, refreshKey]);

  const handleRefreshAll = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Filter platforms by availability and type
  const availableUserIdPlatforms = USER_ID_PLATFORMS.filter(p => platformInfo[p].available);
  const comingSoonPlatforms = USER_ID_PLATFORMS.filter(p => !platformInfo[p].available);
  const availableCustomPlatforms = CUSTOM_PLATFORMS.filter(p => platformInfo[p].available);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="stagger-children space-y-2 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/25">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Social Flood
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Connect your social accounts and grow your personal brand
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Badge variant="outline" className="gap-1.5">
              <Server className="h-3 w-3" />
              API: localhost:3000
            </Badge>
            {savedUserId && (
              <Badge variant="secondary" className="gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                {connectedCount} connected
              </Badge>
            )}
          </div>
        </header>

        {/* User ID Configuration */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              User Configuration
            </CardTitle>
            <CardDescription>
              Enter your user ID to manage platform connections. Some platforms (like Pinterest) require a user ID, 
              while others (like TikTok) use global authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Enter your user ID (e.g., user@example.com)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveUserId()}
                  className="h-11"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveUserId} 
                  disabled={!userId || userId === savedUserId}
                  className="h-11"
                >
                  Save User ID
                </Button>
                {savedUserId && (
                  <Button
                    variant="outline"
                    onClick={handleRefreshAll}
                    disabled={checkingStatus}
                    className="h-11"
                  >
                    {checkingStatus ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Refresh All
                  </Button>
                )}
              </div>
            </div>
            {savedUserId && (
              <p className="text-muted-foreground mt-3 text-sm">
                Active user: <code className="bg-muted rounded px-2 py-0.5 font-mono">{savedUserId}</code>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Global Authentication Platforms (TikTok) */}
        {availableCustomPlatforms.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Global Authentication</h2>
              <Badge variant="outline">No user ID required</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <TikTokCard key={refreshKey} />
            </div>
          </section>
        )}

        {/* User ID Based Platforms */}
        {savedUserId ? (
          <>
            {/* Available Platforms */}
            {availableUserIdPlatforms.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">User-Based Integrations</h2>
                  <Badge variant="success">{availableUserIdPlatforms.length} available</Badge>
                </div>
                <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableUserIdPlatforms.map((platform) => (
                    <PlatformCard
                      key={`${platform}-${refreshKey}`}
                      platform={platform}
                      userId={savedUserId}
                      onStatusChange={checkAllStatuses}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Coming Soon Platforms */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-muted-foreground text-xl font-semibold">Coming Soon</h2>
                <Badge variant="outline">{comingSoonPlatforms.length} platforms</Badge>
              </div>
              <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoonPlatforms.map((platform) => (
                  <PlatformCard
                    key={platform}
                    platform={platform}
                    userId={savedUserId}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted mb-4 rounded-full p-4">
                <User className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No User ID Set</h3>
              <p className="text-muted-foreground max-w-md">
                Enter your user ID above to view and manage user-based platform connections (like Pinterest). 
                TikTok uses global authentication and doesn't require a user ID.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-muted-foreground border-t pt-6 text-center text-sm">
          <p>
            OAuth Integration Tester • Backend running on{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono">localhost:3000</code>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
