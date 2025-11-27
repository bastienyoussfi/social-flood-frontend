import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlatformIcon } from '@/components/PlatformIcon';
import { 
  type TikTokUser,
  getLoginUrl, 
  getTikTokUsers,
} from '@/lib/api';
import { 
  CheckCircle, 
  Loader2, 
  ExternalLink, 
  RefreshCw,
  Clock,
  User,
  Users,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';

export function TikTokCard() {
  const [users, setUsers] = useState<TikTokUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getTikTokUsers();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleConnect = () => {
    const url = getLoginUrl('tiktok');
    window.open(url, '_blank', 'width=600,height=700');
  };

  const handleCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  const activeUsers = users.filter(u => !u.isExpired);
  const expiredUsers = users.filter(u => u.isExpired);

  return (
    <Card className="platform-tiktok relative overflow-hidden col-span-full lg:col-span-2">
      {/* Gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ background: 'var(--platform-color)' }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: 'var(--platform-bg)' }}
            >
              <PlatformIcon platform="tiktok" className="h-5 w-5" style={{ color: 'var(--platform-color)' }} />
            </div>
            <div>
              <CardTitle className="text-lg">TikTok</CardTitle>
              <span className="text-muted-foreground text-xs">Global authentication</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            ) : (
              <Badge variant={activeUsers.length > 0 ? 'success' : 'secondary'} className="gap-1">
                <Users className="h-3 w-3" />
                {activeUsers.length} connected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Info banner */}
        <div className="bg-muted/30 text-muted-foreground rounded-lg border border-dashed p-3 text-sm">
          <p>
            TikTok uses global authentication. Click connect to authorize a TikTok account, 
            then use the TikTok User ID in your API requests.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg border border-destructive/20 p-3 text-sm">
            {error}
          </div>
        )}

        {/* Connected users list */}
        {users.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              Authenticated Accounts
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeUsers.map((user) => (
                <div 
                  key={user.tiktokUserId}
                  className="bg-muted/30 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {user.tiktokUsername || 'Unknown User'}
                      </span>
                    </div>
                    <Badge variant="success" className="text-xs">Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">User ID:</span>
                    <code className="bg-secondary rounded px-2 py-0.5 font-mono text-xs flex-1 truncate">
                      {user.tiktokUserId}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyId(user.tiktokUserId)}
                    >
                      {copiedId === user.tiktokUserId ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Expires: {formatDate(user.expiresAt)}
                    </div>
                    {user.scopes && user.scopes.length > 0 && (
                      <div className="flex gap-1">
                        {user.scopes.slice(0, 2).map(scope => (
                          <span key={scope} className="bg-secondary rounded px-1.5 py-0.5">
                            {scope}
                          </span>
                        ))}
                        {user.scopes.length > 2 && (
                          <span className="bg-secondary rounded px-1.5 py-0.5">
                            +{user.scopes.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Expired users */}
              {expiredUsers.length > 0 && (
                <>
                  <h4 className="text-sm font-medium flex items-center gap-2 mt-4 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Expired Tokens
                  </h4>
                  {expiredUsers.map((user) => (
                    <div 
                      key={user.tiktokUserId}
                      className="bg-warning/10 border border-warning/20 rounded-lg p-3 opacity-70"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {user.tiktokUsername || user.tiktokUserId}
                        </span>
                        <Badge variant="outline" className="text-xs text-warning border-warning">
                          Expired
                        </Badge>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && users.length === 0 && !error && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No TikTok accounts connected yet
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleConnect}
            className="flex-1"
            style={{ 
              background: 'var(--platform-color)',
              color: 'white'
            }}
          >
            <ExternalLink className="h-4 w-4" />
            Connect TikTok Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

