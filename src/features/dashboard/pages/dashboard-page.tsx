import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { LayoutDashboard } from 'lucide-react';

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.dashboard.title"
        descriptionKey="features.dashboard.subtitle"
      />
      <EmptyState
        icon={LayoutDashboard}
        titleKey="features.dashboard.title"
        descriptionKey="features.dashboard.subtitle"
      />
    </div>
  );
}
