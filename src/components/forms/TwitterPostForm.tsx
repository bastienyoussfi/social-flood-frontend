import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postToTwitter, type TwitterPostRequest } from '@/lib/api';
import { Loader2, Send, Image, X } from 'lucide-react';

interface TwitterPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function TwitterPostForm({ onSuccess, onError }: TwitterPostFormProps) {
  const [formData, setFormData] = useState<TwitterPostRequest>({
    text: '',
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postToTwitter({
        ...formData,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });
      onSuccess?.(response.message || 'Posted to Twitter successfully!');
      setFormData({ text: '', images: [] });
      setImageUrls([]);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to Twitter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageUrl = () => {
    if (imageUrls.length < 4) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const updateImageUrl = (index: number, url: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = url;
    setImageUrls(newUrls);
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="twitter-text" required>
              Tweet Text
            </Label>
            <Textarea
              id="twitter-text"
              placeholder="What's happening?"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              maxLength={280}
              showCounter
              className="mt-2 min-h-[120px]"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Images (Optional, max 4)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageUrl}
                disabled={imageUrls.length >= 4}
              >
                <Image className="mr-2 h-4 w-4" />
                Add Image URL
              </Button>
            </div>
            {imageUrls.map((url, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <Input
                  placeholder={`Image URL ${index + 1}`}
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeImageUrl(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
                Post to Twitter
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
