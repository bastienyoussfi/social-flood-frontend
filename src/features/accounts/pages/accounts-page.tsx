import { PageHeader } from '@/components/features/page-header';
import { EmptyState } from '@/components/features/empty-state';
import { UserCircle } from 'lucide-react';

export function AccountsPage() {
  return (
    <div>
      <PageHeader
        titleKey="features.accounts.title"
        descriptionKey="features.accounts.subtitle"
      />
      <EmptyState
        icon={UserCircle}
        titleKey="features.accounts.emptyState.title"
        descriptionKey="features.accounts.emptyState.description"
      />
    </div>
  );
}
