import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/PlatformIcon';
import { 
  type Platform, 
  type PlatformStatus, 
  platformInfo, 
  getLoginUrl, 
  getStatus, 
  disconnect 
} from '@/lib/api';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  Trash2,
  RefreshCw,
  Clock,
  User,
  Shield
} from 'lucide-react';

interface PlatformCardProps {
  platform: Platform;
  userId: string;
  onStatusChange?: () => void;
}

export function PlatformCard({ platform, userId, onStatusChange }: PlatformCardProps) {
  const [status, setStatus] = useState<PlatformStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const info = platformInfo[platform];
  const isAvailable = info.available;

  const fetchStatus = useCallback(async () => {
    if (!userId || !isAvailable) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await getStatus(platform, userId);
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [platform, userId, isAvailable]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = () => {
    const url = getLoginUrl(platform, userId);
    window.open(url, '_blank', 'width=600,height=700');
  };

  const handleDisconnect = async () => {
    if (!confirm(`Are you sure you want to disconnect ${info.name}?`)) {
      return;
    }

    setDisconnecting(true);
    setError(null);

    try {
      await disconnect(platform, userId);
      setStatus(prev => prev ? { ...prev, connected: false } : null);
      onStatusChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setDisconnecting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card 
      className={`platform-${platform} relative overflow-hidden transition-all duration-300 hover:border-[var(--platform-color)]/50`}
    >
      {/* Subtle gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ background: `var(--platform-color)` }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--platform-bg)' }}
            >
              <PlatformIcon platform={platform} className="h-5 w-5" style={{ color: 'var(--platform-color)' }} />
            </div>
            <div>
              <CardTitle className="text-lg">{info.name}</CardTitle>
              {!isAvailable && (
                <span className="text-muted-foreground text-xs">Coming soon</span>
              )}
              {isAvailable && info.description && (
                <span className="text-muted-foreground text-xs">{info.description}</span>
              )}
            </div>
          </div>
          
          {/* Status indicator */}
          {isAvailable && (
            <div className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              ) : status?.connected ? (
                <div className="flex items-center gap-1.5 text-success">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm">Not connected</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isAvailable ? (
          <div className="bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-4 text-center text-sm">
            OAuth integration not yet implemented
          </div>
        ) : (
          <>
            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 text-destructive rounded-lg border border-destructive/20 p-3 text-sm">
                {error}
              </div>
            )}

            {/* Connection details */}
            {status?.connected && (
              <div className="bg-muted/30 space-y-2 rounded-lg p-3">
                {status.platformUsername && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">Account:</span>
                    <span className="font-medium">{status.platformUsername}</span>
                  </div>
                )}
                {status.platformUserId && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground ml-6">ID:</span>
                    <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-xs">
                      {status.platformUserId}
                    </code>
                  </div>
                )}
                {status.scopes && status.scopes.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <span className="text-muted-foreground">Scopes:</span>
                    <div className="flex flex-wrap gap-1">
                      {status.scopes.map(scope => (
                        <span 
                          key={scope} 
                          className="bg-secondary rounded px-1.5 py-0.5 font-mono text-xs"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {status.expiresAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <span className="text-muted-foreground">Expires:</span>
                    <span>{formatDate(status.expiresAt)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              {status?.connected ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchStatus}
                    disabled={loading}
                    className="flex-1"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="flex-1"
                  >
                    {disconnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handleConnect}
                  disabled={loading || !userId}
                  className="w-full"
                  style={{ 
                    background: 'var(--platform-color)',
                    color: 'white'
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Connect {info.name}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
