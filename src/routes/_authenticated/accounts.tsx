import { createFileRoute } from '@tanstack/react-router';
import { AccountsPage } from '@/features/accounts/pages/accounts-page';

export const Route = createFileRoute('/_authenticated/accounts')({
  component: AccountsPage,
} as any);
