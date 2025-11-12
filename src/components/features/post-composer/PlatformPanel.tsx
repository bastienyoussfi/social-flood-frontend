import { useTranslation } from 'react-i18next';
import { Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Platform } from '@/types/post';

interface PlatformPanelProps {
  platform: Platform;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const platformIcons = {
  linkedin: Linkedin,
  twitter: Twitter,
};

const platformColors = {
  linkedin: 'border-linkedin/20 bg-linkedin/5',
  twitter: 'border-twitter/20 bg-twitter/5',
};

export function PlatformPanel({
  platform,
  enabled,
  onToggle,
  children,
  className,
}: PlatformPanelProps) {
  const { t } = useTranslation();
  const Icon = platformIcons[platform];
  const platformNameKey = `composer.platforms.${platform}`;

  return (
    <div
      className={cn(
        'border-border rounded-lg border bg-card transition-all duration-200',
        enabled ? platformColors[platform] : 'opacity-60',
        className
      )}
    >
      {/* Panel Header */}
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              platform === 'linkedin' && 'bg-linkedin text-linkedin-foreground',
              platform === 'twitter' && 'bg-twitter text-twitter-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-none">{t(platformNameKey)}</h3>
            <p className="text-muted-foreground mt-1 text-xs">
              {enabled ? t('composer.panel.enabled') : t('composer.panel.disabled')}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggle(!enabled)}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            enabled ? 'bg-primary' : 'bg-muted'
          )}
          aria-label={t('composer.panel.toggleTooltip', { platform: t(platformNameKey) })}
        >
          <span
            className={cn(
              'bg-background absolute top-0.5 h-5 w-5 rounded-full shadow-sm transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0.5'
            )}
          />
        </button>
      </div>

      {/* Panel Content */}
      <div className={cn('p-4', !enabled && 'pointer-events-none opacity-50')}>
        {children}
      </div>
    </div>
  );
}
