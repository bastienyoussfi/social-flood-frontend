import { createFileRoute } from '@tanstack/react-router';
import { PostingPage } from '@/features/posting/pages/posting-page';

export const Route = createFileRoute('/_authenticated/posting')({
  component: PostingPage,
} as any);
