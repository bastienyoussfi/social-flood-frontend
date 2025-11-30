import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { postToPinterest, type PinterestPostRequest } from '@/lib/api';
import { Loader2, Send } from 'lucide-react';

interface PinterestPostFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function PinterestPostForm({ onSuccess, onError }: PinterestPostFormProps) {
  const [formData, setFormData] = useState<PinterestPostRequest>({
    boardId: '',
    imageUrl: '',
    title: '',
    description: '',
    link: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.boardId.trim() || !formData.imageUrl.trim() || !formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await postToPinterest({
        boardId: formData.boardId,
        imageUrl: formData.imageUrl,
        title: formData.title,
        description: formData.description || undefined,
        link: formData.link || undefined,
      });
      onSuccess?.(response.message || 'Posted to Pinterest successfully!');
      setFormData({ boardId: '', imageUrl: '', title: '', description: '', link: '' });
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Failed to post to Pinterest');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pinterest-board" required>
              Board ID
            </Label>
            <Input
              id="pinterest-board"
              placeholder="Your board ID"
              value={formData.boardId}
              onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="pinterest-image" required>
              Image URL
            </Label>
            <Input
              id="pinterest-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="pinterest-title" required>
              Pin Title
            </Label>
            <Input
              id="pinterest-title"
              placeholder="Give your pin a title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-2"
              required
            />
          </div>

          <div>
            <Label htmlFor="pinterest-description">Description (Optional)</Label>
            <Textarea
              id="pinterest-description"
              placeholder="Describe your pin..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="pinterest-link">Destination Link (Optional)</Label>
            <Input
              id="pinterest-link"
              type="url"
              placeholder="https://example.com"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="mt-2"
            />
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting || !formData.boardId.trim() || !formData.imageUrl.trim() || !formData.title.trim()
            }
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
                Post to Pinterest
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
