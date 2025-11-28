import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Share2, UserCheck, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrivacyPolicy() {
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-success to-success/60 shadow-lg shadow-success/25">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Privacy Policy
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
              <Lock className="h-5 w-5 text-success" />
              Your Privacy Matters
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              At Social Flood, we are committed to protecting your privacy and ensuring the 
              security of your personal information. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Database className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We collect information in the following ways:
            </p>
            
            <div className="ml-4 space-y-4">
              <div>
                <h3 className="font-medium text-foreground">Information You Provide</h3>
                <ul className="ml-6 mt-2 list-disc space-y-2 text-muted-foreground">
                  <li>Account information (email address, name, profile picture)</li>
                  <li>Social media account credentials through OAuth authentication</li>
                  <li>Content you create, upload, or share through our Services</li>
                  <li>Communications with us (support requests, feedback)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">Information from Third Parties</h3>
                <ul className="ml-6 mt-2 list-disc space-y-2 text-muted-foreground">
                  <li>Profile information from connected social media platforms</li>
                  <li>Analytics and engagement data from your social media accounts</li>
                  <li>Access tokens and refresh tokens for maintaining platform connections</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground">Information Collected Automatically</h3>
                <ul className="ml-6 mt-2 list-disc space-y-2 text-muted-foreground">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>IP address and approximate location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Eye className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We use the collected information for the following purposes:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>To provide, maintain, and improve our Services</li>
              <li>To authenticate your identity and manage your account</li>
              <li>To connect and interact with your social media accounts on your behalf</li>
              <li>To send you important updates, notifications, and service-related communications</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage patterns and optimize user experience</li>
              <li>To detect, prevent, and address security issues and fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Share2 className="h-5 w-5 text-primary" />
              3. How We Share Your Information
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We may share your information in the following circumstances:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">With Social Media Platforms:</strong> To enable 
                features you request, we share necessary data with platforms you've connected
              </li>
              <li>
                <strong className="text-foreground">Service Providers:</strong> With third-party 
                vendors who assist us in operating our Services (hosting, analytics, support)
              </li>
              <li>
                <strong className="text-foreground">Legal Requirements:</strong> When required by 
                law, court order, or governmental authority
              </li>
              <li>
                <strong className="text-foreground">Business Transfers:</strong> In connection with 
                a merger, acquisition, or sale of assets
              </li>
              <li>
                <strong className="text-foreground">With Your Consent:</strong> For any other 
                purpose with your explicit consent
              </li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              <strong className="text-foreground">We do not sell your personal information to third parties.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              4. Data Security
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect 
              your personal information, including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure OAuth token storage and management</li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              However, no method of transmission over the Internet is 100% secure. We cannot 
              guarantee absolute security of your data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <UserCheck className="h-5 w-5 text-primary" />
              5. Your Rights and Choices
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Request correction of inaccurate data
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request deletion of your personal data
              </li>
              <li>
                <strong className="text-foreground">Portability:</strong> Request transfer of your data to another service
              </li>
              <li>
                <strong className="text-foreground">Opt-out:</strong> Opt out of certain data processing activities
              </li>
              <li>
                <strong className="text-foreground">Disconnect:</strong> Revoke access to connected social media accounts at any time
              </li>
            </ul>
            <p className="leading-relaxed text-muted-foreground">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Trash2 className="h-5 w-5 text-primary" />
              6. Data Retention
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              We retain your personal information for as long as necessary to provide our Services 
              and fulfill the purposes described in this Privacy Policy. When you delete your 
              account, we will delete or anonymize your personal information within 30 days, 
              unless retention is required for legal purposes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              7. International Data Transfers
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Your information may be transferred to and processed in countries other than your 
              country of residence. These countries may have different data protection laws. 
              We ensure appropriate safeguards are in place for such transfers in compliance 
              with applicable laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">8. Children's Privacy</h2>
            <p className="leading-relaxed text-muted-foreground">
              Our Services are not intended for children under 13 years of age. We do not 
              knowingly collect personal information from children under 13. If we become 
              aware that we have collected personal information from a child under 13, we 
              will take steps to delete such information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">9. Cookies and Tracking</h2>
            <p className="leading-relaxed text-muted-foreground">
              We use cookies and similar technologies to enhance your experience. You can 
              control cookies through your browser settings. Note that disabling cookies may 
              affect the functionality of our Services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
            <p className="leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any 
              material changes by posting the updated policy on our website and updating the 
              "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="rounded-xl border border-success/20 bg-success/5 p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">11. Contact Us</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <div className="mt-4 space-y-2">
              <p className="font-mono text-success">
                privacy@socialflood.app
              </p>
              <p className="text-muted-foreground">
                You may also reach out to our Data Protection Officer for GDPR-related inquiries.
              </p>
            </div>
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

