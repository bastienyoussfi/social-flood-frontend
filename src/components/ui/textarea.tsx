import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  showCounter?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, showCounter = false, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;
    const isNearLimit = maxLength ? currentLength / maxLength > 0.8 : false;
    const isAtLimit = maxLength ? currentLength >= maxLength : false;

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            isAtLimit && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCounter && maxLength && (
          <div
            className={cn(
              'absolute bottom-2 right-2 text-xs font-medium transition-colors',
              isAtLimit
                ? 'text-destructive'
                : isNearLimit
                  ? 'text-warning'
                  : 'text-muted-foreground'
            )}
          >
            {currentLength} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
