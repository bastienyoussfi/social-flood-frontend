import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postToBluesky, type BlueskyPostRequest } from '@/lib/api';
import { Loader2, Send } from 'lucide-react';

interface BlueskyPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function BlueskyPostForm({ onSuccess, onError }: BlueskyPostFormProps) {
  const [formData, setFormData] = useState<BlueskyPostRequest>({
    text: '',
    linkUrl: '',
    linkTitle: '',
    linkDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postToBluesky({
        text: formData.text,
        linkUrl: formData.linkUrl || undefined,
        linkTitle: formData.linkTitle || undefined,
        linkDescription: formData.linkDescription || undefined,
      });
      onSuccess?.(response.message || 'Posted to Bluesky successfully!');
      setFormData({ text: '', linkUrl: '', linkTitle: '', linkDescription: '' });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to Bluesky');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bluesky-text" required>
              Post Text
            </Label>
            <Textarea
              id="bluesky-text"
              placeholder="What's on your mind?"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              maxLength={300}
              showCounter
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold">Link Card (Optional)</h4>

            <div>
              <Label htmlFor="bluesky-link-url">Link URL</Label>
              <Input
                id="bluesky-link-url"
                type="url"
                placeholder="https://example.com"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="bluesky-link-title">Link Title</Label>
              <Input
                id="bluesky-link-title"
                placeholder="Link title"
                value={formData.linkTitle}
                onChange={(e) => setFormData({ ...formData, linkTitle: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="bluesky-link-desc">Link Description</Label>
              <Textarea
                id="bluesky-link-desc"
                placeholder="Brief description of the link"
                value={formData.linkDescription}
                onChange={(e) => setFormData({ ...formData, linkDescription: e.target.value })}
                className="mt-2 min-h-[60px]"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || !formData.text.trim()} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post to Bluesky
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
