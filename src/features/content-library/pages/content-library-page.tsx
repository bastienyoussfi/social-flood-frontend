import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { FolderOpen } from 'lucide-react';

export function ContentLibraryPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.contentLibrary.title"
        descriptionKey="features.contentLibrary.subtitle"
      />
      <EmptyState
        icon={FolderOpen}
        titleKey="features.contentLibrary.emptyState.title"
        descriptionKey="features.contentLibrary.emptyState.description"
      />
    </div>
  );
}
