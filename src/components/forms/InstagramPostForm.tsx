import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postToInstagram, type InstagramPostRequest } from '@/lib/api';
import { Loader2, Send, Image, X } from 'lucide-react';

interface InstagramPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function InstagramPostForm({ onSuccess, onError }: InstagramPostFormProps) {
  const [formData, setFormData] = useState<InstagramPostRequest>({
    userId: '',
    mediaUrls: [''],
    caption: '',
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId.trim() || formData.mediaUrls.filter((url) => url.trim()).length === 0) return;

    setIsSubmitting(true);
    try {
      const response = await postToInstagram({
        userId: formData.userId,
        mediaUrls: formData.mediaUrls.filter((url) => url.trim()),
        caption: formData.caption || undefined,
        location: formData.location || undefined,
      });
      onSuccess?.(response.message || 'Posted to Instagram successfully!');
      setFormData({ userId: '', mediaUrls: [''], caption: '', location: '' });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to Instagram');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMediaUrl = () => {
    if (formData.mediaUrls.length < 10) {
      setFormData({ ...formData, mediaUrls: [...formData.mediaUrls, ''] });
    }
  };

  const updateMediaUrl = (index: number, url: string) => {
    const newUrls = [...formData.mediaUrls];
    newUrls[index] = url;
    setFormData({ ...formData, mediaUrls: newUrls });
  };

  const removeMediaUrl = (index: number) => {
    if (formData.mediaUrls.length > 1) {
      setFormData({
        ...formData,
        mediaUrls: formData.mediaUrls.filter((_, i) => i !== index),
      });
    }
  };

  const validMediaCount = formData.mediaUrls.filter((url) => url.trim()).length;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="instagram-user" required>
              User ID
            </Label>
            <Input
              id="instagram-user"
              placeholder="Your Instagram user ID"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label required>Media URLs (1-10 items)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMediaUrl}
                disabled={formData.mediaUrls.length >= 10}
              >
                <Image className="mr-2 h-4 w-4" />
                Add Media URL
              </Button>
            </div>
            {formData.mediaUrls.map((url, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <Input
                  placeholder={`Media URL ${index + 1} (image or video)`}
                  value={url}
                  onChange={(e) => updateMediaUrl(index, e.target.value)}
                  required
                />
                {formData.mediaUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMediaUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="mt-1 text-xs text-muted-foreground">
              {validMediaCount} / 10 media item{validMediaCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div>
            <Label htmlFor="instagram-caption">Caption (Optional)</Label>
            <Textarea
              id="instagram-caption"
              placeholder="Write a caption..."
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="instagram-location">Location (Optional)</Label>
            <Input
              id="instagram-location"
              placeholder="Add location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.userId.trim() || validMediaCount === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post to Instagram
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
