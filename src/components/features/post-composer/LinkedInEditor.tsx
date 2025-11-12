import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CHAR_LIMITS } from '@/types/post';

interface LinkedInEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export function LinkedInEditor({ content, onChange, disabled }: LinkedInEditorProps) {
  const { t } = useTranslation();
  const maxChars = CHAR_LIMITS.linkedin;
  const currentChars = content.length;
  const isOverLimit = currentChars > maxChars;

  return (
    <div className="space-y-3">
      {/* Editor */}
      <Textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('composer.editor.placeholderLinkedIn')}
        disabled={disabled}
        className={cn(
          'min-h-[200px] resize-none',
          isOverLimit && 'border-destructive focus-visible:ring-destructive'
        )}
      />

      {/* Character Counter */}
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'text-muted-foreground text-sm',
            isOverLimit && 'text-destructive font-medium'
          )}
        >
          {t('composer.editor.characterCount', {
            current: currentChars,
            max: maxChars,
          })}
        </div>
        {isOverLimit && (
          <span className="text-destructive text-xs">
            {t('composer.errors.contentTooLong')}
          </span>
        )}
      </div>
    </div>
  );
}
