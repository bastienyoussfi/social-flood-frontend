import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.settings.title"
        descriptionKey="features.settings.subtitle"
      />
      <EmptyState
        icon={Settings}
        titleKey="features.settings.emptyState.title"
        descriptionKey="features.settings.emptyState.description"
      />
    </div>
  );
}
