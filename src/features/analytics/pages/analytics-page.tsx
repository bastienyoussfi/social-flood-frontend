import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { BarChart3 } from 'lucide-react';

export function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.analytics.title"
        descriptionKey="features.analytics.subtitle"
      />
      <EmptyState
        icon={BarChart3}
        titleKey="features.analytics.emptyState.title"
        descriptionKey="features.analytics.emptyState.description"
      />
    </div>
  );
}
