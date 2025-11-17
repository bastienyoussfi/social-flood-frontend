import { useTranslation } from 'react-i18next';
import { EmailSubscribeForm } from './EmailSubscribeForm';
import { Footer } from './Footer';

export function LandingPage() {
  const { t } = useTranslation();

  const footerLinks = [
    {
      labelKey: 'landing.footer.links.terms',
      href: '/terms',
    },
    {
      labelKey: 'landing.footer.links.privacy',
      href: '/privacy',
    },
  ];

  const handleEmailSubmit = async (email: string) => {
    // TODO: Implement actual API call for email subscription
    console.log('Email submitted:', email);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12 animate-in fade-in duration-700">
          {/* Tagline */}
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base uppercase tracking-widest text-muted-foreground font-medium animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
              {t('landing.hero.tagline')}
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-top-6 duration-700 delay-300">
              {t('landing.hero.headline')}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-700 delay-450">
              {t('landing.hero.description')}
            </p>
          </div>

          {/* Email Subscribe Form */}
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <EmailSubscribeForm
              placeholderKey="landing.hero.form.placeholder"
              buttonKey="landing.hero.form.button"
              successKey="landing.hero.form.success"
              errorKey="landing.hero.form.error"
              onSubmit={handleEmailSubmit}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer copyrightKey="landing.footer.copyright" links={footerLinks} />
    </div>
  );
}
