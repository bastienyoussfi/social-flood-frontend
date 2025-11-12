import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { PenSquare } from 'lucide-react';

export function PostingPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.posting.title"
        descriptionKey="features.posting.subtitle"
      />
      <EmptyState
        icon={PenSquare}
        titleKey="features.posting.emptyState.title"
        descriptionKey="features.posting.emptyState.description"
      />
    </div>
  );
}
