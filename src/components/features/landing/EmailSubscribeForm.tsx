import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailSubscribeFormProps {
  placeholderKey: string;
  buttonKey: string;
  successKey: string;
  errorKey: string;
  onSubmit?: (email: string) => Promise<void>;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function EmailSubscribeForm({
  placeholderKey,
  buttonKey,
  successKey,
  errorKey,
  onSubmit,
}: EmailSubscribeFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setState('error');
      return;
    }

    setState('submitting');

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setState('success');
      setEmail('');
    } catch (error) {
      setState('error');
    }
  };

  const isSuccess = state === 'success';
  const isError = state === 'error';
  const isSubmitting = state === 'submitting';

  return (
    <div className="w-full max-w-md space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder={t(placeholderKey)}
          disabled={isSubmitting}
          className="flex-1 h-12 px-6 text-base bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
          aria-label={t(placeholderKey)}
        />
        <Button
          type="submit"
          disabled={isSubmitting || !email}
          className="h-12 px-8 text-base font-semibold whitespace-nowrap"
        >
          {t(buttonKey)}
        </Button>
      </form>

      {isSuccess && (
        <p className="text-sm text-center text-success animate-in fade-in duration-300">
          {t(successKey)}
        </p>
      )}

      {isError && (
        <p className="text-sm text-center text-error animate-in fade-in duration-300">
          {t(errorKey)}
        </p>
      )}
    </div>
  );
}
