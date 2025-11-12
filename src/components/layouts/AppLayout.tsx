import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="border-border sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-primary-foreground">SF</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">
                {t('composer.title')}
              </h1>
              <p className="text-muted-foreground text-xs">
                {t('composer.subtitle')}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? t('common.labels.lightMode') : t('common.labels.darkMode')}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
