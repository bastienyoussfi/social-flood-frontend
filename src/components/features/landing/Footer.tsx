import { useTranslation } from 'react-i18next';

interface FooterLink {
  labelKey: string;
  href: string;
}

interface FooterProps {
  copyrightKey: string;
  links: FooterLink[];
}

export function Footer({ copyrightKey, links }: FooterProps) {
  const { t } = useTranslation();

  return (
    <footer className="w-full border-t border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t(copyrightKey)}
          </p>

          <nav className="flex gap-6">
            {links.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(link.labelKey)}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
