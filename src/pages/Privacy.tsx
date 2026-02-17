import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/auth?mode=signup">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign Up
          </Button>
        </Link>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">1. Introduction</h2>
            <p>UK Pathway Hub ("we", "us", "our") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and share your information in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.</p>
            <p>We are the data controller for the personal data we process. If you have any questions, contact our Data Protection Officer at <a href="mailto:dpo@ukpathway.com" className="text-primary underline">dpo@ukpathway.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">2. Information We Collect</h2>
            <p>We collect the following categories of personal data:</p>
            <h3 className="text-lg font-semibold text-foreground mt-4">a) Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, password.</li>
              <li><strong>Profile Data:</strong> Industry, job preferences, skills, work experience.</li>
              <li><strong>Documents:</strong> CVs, cover letters, and other uploaded files.</li>
              <li><strong>Payment Information:</strong> Billing details processed securely via Stripe (we do not store full card numbers).</li>
              <li><strong>Communications:</strong> Messages sent through our chat support system.</li>
            </ul>
            <h3 className="text-lg font-semibold text-foreground mt-4">b) Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address.</li>
              <li><strong>Cookies:</strong> Essential and analytics cookies (see Section 8).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">3. Lawful Basis for Processing</h2>
            <p>We process your data under the following lawful bases as defined by UK GDPR Article 6:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract Performance (Art. 6(1)(b)):</strong> To provide our services and manage your account.</li>
              <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> To improve our platform, prevent fraud, and ensure security.</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> For marketing communications and optional analytics. You may withdraw consent at any time.</li>
              <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> To comply with UK tax, financial, and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">4. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and personalising our services (visa guidance, job matching, accommodation search).</li>
              <li>Processing payments and managing subscriptions.</li>
              <li>AI-powered CV analysis and job recommendations.</li>
              <li>Communicating service updates, notifications, and support responses.</li>
              <li>Improving platform functionality and user experience.</li>
              <li>Detecting and preventing fraudulent or unauthorised activity.</li>
              <li>Complying with legal and regulatory obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">5. Data Sharing</h2>
            <p>We do not sell your personal data. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Payment processors (Stripe), cloud hosting, email services — all bound by data processing agreements.</li>
              <li><strong>Employers:</strong> Only when you apply for jobs through our platform and with your explicit consent.</li>
              <li><strong>Legal Authorities:</strong> When required by law, court order, or to protect our legal rights.</li>
              <li><strong>AI Processing:</strong> Anonymised data may be used for AI model improvements. No personally identifiable information is shared with third-party AI providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">6. International Data Transfers</h2>
            <p>Your data is primarily stored within the United Kingdom and European Economic Area. Where data is transferred outside the UK/EEA, we ensure appropriate safeguards are in place, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>UK adequacy decisions.</li>
              <li>Standard Contractual Clauses (SCCs) approved by the ICO.</li>
              <li>Binding Corporate Rules where applicable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">7. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Data:</strong> Retained for the duration of your account and up to 2 years after deletion for legal compliance.</li>
              <li><strong>Payment Records:</strong> Retained for 7 years as required by HMRC.</li>
              <li><strong>Chat Messages:</strong> Retained for 1 year after the last interaction.</li>
              <li><strong>CVs and Documents:</strong> Deleted within 30 days of account closure unless otherwise requested.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">8. Cookies</h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the platform to function (authentication, security).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform (opt-in only).</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings or our cookie consent banner.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">9. Your Rights Under UK GDPR</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access (Art. 15):</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification (Art. 16):</strong> Request correction of inaccurate data.</li>
              <li><strong>Right to Erasure (Art. 17):</strong> Request deletion of your personal data ("right to be forgotten").</li>
              <li><strong>Right to Restrict Processing (Art. 18):</strong> Request limitation of how we use your data.</li>
              <li><strong>Right to Data Portability (Art. 20):</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests or direct marketing.</li>
              <li><strong>Right Not to Be Subject to Automated Decision-Making (Art. 22):</strong> Request human review of decisions made solely by automated means.</li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:dpo@ukpathway.com" className="text-primary underline">dpo@ukpathway.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">10. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your data, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest.</li>
              <li>Access controls and authentication mechanisms.</li>
              <li>Regular security audits and vulnerability assessments.</li>
              <li>Staff training on data protection.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">11. Children's Privacy</h2>
            <p>Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal data from children. If we become aware that we have collected data from a child, we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">12. Complaints</h2>
            <p>If you are unhappy with how we handle your data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):</p>
            <ul className="list-none space-y-1">
              <li>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">ico.org.uk</a></li>
              <li>Phone: 0303 123 1113</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">13. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify registered users of material changes via email. The "Last updated" date at the top of this page indicates when it was last revised.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">14. Contact Us</h2>
            <p>For any privacy-related enquiries:</p>
            <ul className="list-none space-y-1">
              <li>Data Protection Officer: <a href="mailto:dpo@ukpathway.com" className="text-primary underline">dpo@ukpathway.com</a></li>
              <li>General Support: <a href="mailto:support@ukpathway.com" className="text-primary underline">support@ukpathway.com</a></li>
              <li>Phone: +44 20 1234 5678</li>
              <li>Address: London, United Kingdom</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
