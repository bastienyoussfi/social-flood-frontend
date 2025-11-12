import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { Calendar } from 'lucide-react';

export function SchedulingPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.scheduling.title"
        descriptionKey="features.scheduling.subtitle"
      />
      <EmptyState
        icon={Calendar}
        titleKey="features.scheduling.emptyState.title"
        descriptionKey="features.scheduling.emptyState.description"
      />
    </div>
  );
}
