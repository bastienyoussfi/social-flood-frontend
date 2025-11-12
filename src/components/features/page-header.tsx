import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  titleKey: string;
  descriptionKey?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  titleKey,
  descriptionKey,
  actions,
}: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1>
        {descriptionKey && (
          <p className="mt-2 text-muted-foreground">{t(descriptionKey)}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
