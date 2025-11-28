import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TermsOfService() {
  const lastUpdated = 'November 28, 2025';
  
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-12 space-y-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/25">
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Terms of Service
              </h1>
              <p className="mt-1 text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-invert max-w-none space-y-8">
          <section className="rounded-xl border border-border bg-card/50 p-6 md:p-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
              <Zap className="h-5 w-5 text-primary" />
              Welcome to Social Flood
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              These Terms of Service ("Terms") govern your access to and use of Social Flood, 
              including our website, applications, APIs, and any other software or services 
              offered by Social Flood ("Services"). By accessing or using our Services, you 
              agree to be bound by these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              By creating an account or using our Services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms. If you do not agree to these 
              Terms, you may not access or use the Services.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              You must be at least 13 years old to use our Services. By using our Services, 
              you represent and warrant that you meet this age requirement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Description of Services</h2>
            <p className="leading-relaxed text-muted-foreground">
              Social Flood provides a platform that allows users to connect and manage multiple 
              social media accounts in one place. Our Services include:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>OAuth integration with various social media platforms</li>
              <li>Social media account management and connection tools</li>
              <li>Content scheduling and publishing features</li>
              <li>Analytics and insights for connected accounts</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p className="leading-relaxed text-muted-foreground">
              To access certain features of our Services, you must create an account. You are 
              responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring all information you provide is accurate and up-to-date</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
            <p className="leading-relaxed text-muted-foreground">
              You agree not to use our Services to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Distribute spam, malware, or other harmful content</li>
              <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the integrity of our Services</li>
              <li>Engage in any activity that could damage our reputation or business</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Third-Party Platforms</h2>
            <p className="leading-relaxed text-muted-foreground">
              Our Services integrate with third-party social media platforms. Your use of these 
              platforms is subject to their respective terms of service and privacy policies. 
              We are not responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>The availability, accuracy, or content of third-party platforms</li>
              <li>Any changes made by third parties to their APIs or services</li>
              <li>Any actions taken by third parties regarding your accounts</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Intellectual Property</h2>
            <p className="leading-relaxed text-muted-foreground">
              All content, features, and functionality of our Services, including but not limited 
              to text, graphics, logos, and software, are owned by Social Flood and are protected 
              by intellectual property laws. You may not copy, modify, distribute, or create 
              derivative works without our prior written consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">7. Disclaimer of Warranties</h2>
            <p className="leading-relaxed text-muted-foreground">
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, 
              SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Limitation of Liability</h2>
            <p className="leading-relaxed text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SOCIAL FLOOD SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF 
              OR RELATED TO YOUR USE OF OUR SERVICES.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Termination</h2>
            <p className="leading-relaxed text-muted-foreground">
              We reserve the right to suspend or terminate your access to our Services at any 
              time, with or without cause, and with or without notice. Upon termination, your 
              right to use the Services will immediately cease.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Changes to Terms</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may modify these Terms at any time. We will notify you of any material changes 
              by posting the updated Terms on our website and updating the "Last updated" date. 
              Your continued use of our Services after such changes constitutes your acceptance 
              of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">11. Governing Law</h2>
            <p className="leading-relaxed text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which Social Flood is established, without regard to its conflict 
              of law provisions.
            </p>
          </section>

          <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">12. Contact Us</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-4 font-mono text-primary">
              support@socialflood.app
            </p>
          </section>
        </article>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Social Flood. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

