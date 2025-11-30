import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlatformCard } from '@/components/PlatformCard';
import { useAuth } from '@/contexts/AuthContext';
import {
  availablePlatforms,
  comingSoonPlatforms,
  getConnections,
  type SocialConnection,
} from '@/lib/api';
import { Zap, RefreshCw, Loader2, Server, CheckCircle2, LogOut, User, PenSquare } from 'lucide-react';

function App() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch all connections for the user
  const fetchConnections = useCallback(async () => {
    setCheckingStatus(true);
    setError(null);
    
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch connections');
      setConnections([]);
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections, refreshKey]);

  const handleRefreshAll = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  // Get connection for a specific platform
  const getConnectionForPlatform = (platform: string): SocialConnection | undefined => {
    return connections.find(c => c.platform === platform);
  };

  const connectedCount = connections.filter(c => c.isActive).length;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <Badge variant="secondary" className="gap-1.5">
              <CheckCircle2 className="h-3 w-3" />
              {connectedCount}/{availablePlatforms.length} connected
            </Badge>
          </div>
        </header>

        {/* User Info Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-12 w-12 rounded-full border-2 border-primary/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h2 className="font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/post">
                <Button className="h-10">
                  <PenSquare className="h-4 w-4" />
                  Create Post
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleRefreshAll}
                disabled={checkingStatus}
                className="h-10"
              >
                {checkingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh All
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="h-10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-destructive/20 bg-destructive/10">
            <CardContent className="p-4 text-center text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {/* Available Platforms */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Connected Platforms</h2>
            <Badge variant="success">{availablePlatforms.length} available</Badge>
          </div>
          <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {availablePlatforms.map((platform) => (
              <PlatformCard
                key={`${platform}-${refreshKey}`}
                platform={platform}
                connection={getConnectionForPlatform(platform)}
                onStatusChange={fetchConnections}
              />
            ))}
          </div>
        </section>

        {/* Coming Soon Platforms */}
        {comingSoonPlatforms.length > 0 && (
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
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-muted-foreground border-t pt-6 text-center text-sm">
          <p>
            OAuth Integration Tester • Backend running on{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono">localhost:3000</code>
          </p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-border">•</span>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
