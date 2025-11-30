import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { postToTikTok, type TikTokPostRequest } from '@/lib/api';
import { Loader2, Send } from 'lucide-react';

interface TikTokPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function TikTokPostForm({ onSuccess, onError }: TikTokPostFormProps) {
  const [formData, setFormData] = useState<TikTokPostRequest>({
    videoUrl: '',
    caption: '',
    privacyLevel: 'PUBLIC',
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.videoUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postToTikTok(formData);
      onSuccess?.(response.message || 'Posted to TikTok successfully!');
      setFormData({
        videoUrl: '',
        caption: '',
        privacyLevel: 'PUBLIC',
        allowComments: true,
        allowDuet: true,
        allowStitch: true,
      });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to TikTok');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tiktok-video" required>
              Video URL
            </Label>
            <Input
              id="tiktok-video"
              type="url"
              placeholder="https://example.com/video.mp4"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="tiktok-caption">Caption (Optional)</Label>
            <Textarea
              id="tiktok-caption"
              placeholder="Add a caption..."
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="tiktok-privacy">Privacy Level</Label>
            <Select
              id="tiktok-privacy"
              value={formData.privacyLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  privacyLevel: e.target.value as 'PUBLIC' | 'FRIENDS' | 'PRIVATE',
                })
              }
              className="mt-2"
            >
              <option value="PUBLIC">Public</option>
              <option value="FRIENDS">Friends</option>
              <option value="PRIVATE">Private</option>
            </Select>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold">Interaction Settings</h4>
            <div className="space-y-2">
              <Checkbox
                label="Allow Comments"
                checked={formData.allowComments}
                onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
              />
              <Checkbox
                label="Allow Duet"
                checked={formData.allowDuet}
                onChange={(e) => setFormData({ ...formData, allowDuet: e.target.checked })}
              />
              <Checkbox
                label="Allow Stitch"
                checked={formData.allowStitch}
                onChange={(e) => setFormData({ ...formData, allowStitch: e.target.checked })}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || !formData.videoUrl.trim()} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post to TikTok
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
