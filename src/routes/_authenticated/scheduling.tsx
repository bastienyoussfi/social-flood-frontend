import { createFileRoute } from '@tanstack/react-router';
import { SchedulingPage } from '@/features/scheduling/pages/scheduling-page';

export const Route = createFileRoute('/_authenticated/scheduling')({
  component: SchedulingPage,
} as any);
