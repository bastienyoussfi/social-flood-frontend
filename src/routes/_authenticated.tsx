import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppLayout } from '@/components/layouts/app-layout';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
} as any);

function AuthenticatedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
