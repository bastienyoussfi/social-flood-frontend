import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  titleKey: string;
  descriptionKey?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  titleKey,
  descriptionKey,
  className,
  children,
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold">{t(titleKey)}</h3>
      {descriptionKey && (
        <p className="mb-4 text-sm text-muted-foreground">
          {t(descriptionKey)}
        </p>
      )}
      {children}
    </div>
  );
}
