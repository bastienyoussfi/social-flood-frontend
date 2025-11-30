import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postToLinkedIn, type LinkedInPostRequest } from '@/lib/api';
import { Loader2, Send } from 'lucide-react';

interface LinkedInPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function LinkedInPostForm({ onSuccess, onError }: LinkedInPostFormProps) {
  const [formData, setFormData] = useState<LinkedInPostRequest>({
    text: '',
    articleUrl: '',
    articleTitle: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postToLinkedIn({
        text: formData.text,
        articleUrl: formData.articleUrl || undefined,
        articleTitle: formData.articleTitle || undefined,
      });
      onSuccess?.(response.message || 'Posted to LinkedIn successfully!');
      setFormData({ text: '', articleUrl: '', articleTitle: '' });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to LinkedIn');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="linkedin-text" required>
              Post Content
            </Label>
            <Textarea
              id="linkedin-text"
              placeholder="Share your professional thoughts..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              maxLength={3000}
              showCounter
              className="mt-2 min-h-[150px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="linkedin-article-url">Article URL (Optional)</Label>
            <Input
              id="linkedin-article-url"
              type="url"
              placeholder="https://example.com/article"
              value={formData.articleUrl}
              onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="linkedin-article-title">Article Title (Optional)</Label>
            <Input
              id="linkedin-article-title"
              placeholder="Article title"
              value={formData.articleTitle}
              onChange={(e) => setFormData({ ...formData, articleTitle: e.target.value })}
              className="mt-2"
            />
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
                Post to LinkedIn
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
