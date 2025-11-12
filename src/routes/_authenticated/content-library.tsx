import { createFileRoute } from '@tanstack/react-router';
import { ContentLibraryPage } from '@/features/content-library/pages/content-library-page';

export const Route = createFileRoute('/_authenticated/content-library')({
  component: ContentLibraryPage,
} as any);
