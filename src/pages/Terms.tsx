import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/auth?mode=signup">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign Up
          </Button>
        </Link>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">1. Introduction</h2>
            <p>Welcome to UK Pathway Hub ("we", "us", "our"). These Terms and Conditions govern your use of our platform and services. By accessing or using UK Pathway Hub, you agree to be bound by these terms in accordance with the laws of England and Wales.</p>
            <p>UK Pathway Hub is a digital platform designed to assist individuals with migration, employment, accommodation, and settlement services in the United Kingdom.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">2. Eligibility</h2>
            <p>You must be at least 18 years old to use our services. By registering, you confirm that all information provided is accurate and that you have the legal right to use our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">3. Services Provided</h2>
            <p>UK Pathway Hub provides the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Visa & Immigration Guidance:</strong> Information and tools to assist with UK visa applications and immigration processes.</li>
              <li><strong>Job Search & Sponsorship:</strong> Access to job listings, CV management, and employer sponsorship opportunities.</li>
              <li><strong>Accommodation Assistance:</strong> Help finding suitable housing in the UK.</li>
              <li><strong>Driving Test Preparation:</strong> Resources and guidance for UK driving theory and practical tests.</li>
              <li><strong>AI-Powered Support:</strong> Personalised recommendations and chat support.</li>
            </ul>
            <p>We act as an information and facilitation platform. We do not provide legal advice, immigration representation, or guarantee employment outcomes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorised access. We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">5. Payments & Subscriptions</h2>
            <p>Certain features of UK Pathway Hub require a paid subscription. By subscribing, you agree to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are displayed in GBP (£) and include VAT where applicable.</li>
              <li>Payments are processed securely through our third-party payment provider (Stripe).</li>
              <li>Subscriptions auto-renew unless cancelled before the renewal date.</li>
              <li>You may cancel your subscription at any time through your account settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">6. Refund Policy</h2>
            <p>We want you to be satisfied with our services. Our refund policy is as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>14-Day Cooling-Off Period:</strong> In accordance with the UK Consumer Contracts Regulations 2013, you have the right to cancel your subscription within 14 days of purchase for a full refund, provided you have not substantially used the service.</li>
              <li><strong>Pro-Rata Refunds:</strong> If you cancel after the 14-day period but within the current billing cycle, you will not receive a refund for the remaining period.</li>
              <li><strong>Service Issues:</strong> If you experience technical issues that prevent you from using the service, contact our support team. We may issue a partial or full refund at our discretion.</li>
              <li><strong>No Refunds For:</strong> One-time purchases (e.g., CV analysis reports), services already rendered, or accounts terminated due to policy violations.</li>
            </ul>
            <p>To request a refund, contact us at <a href="mailto:support@ukpathway.com" className="text-primary underline">support@ukpathway.com</a> with your account details and reason for the request. Refunds are processed within 5–10 business days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">7. Intellectual Property</h2>
            <p>All content, branding, and software on UK Pathway Hub are owned by us or our licensors and are protected by UK and international copyright, trademark, and intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">8. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for any unlawful purpose.</li>
              <li>Submit false, misleading, or fraudulent information.</li>
              <li>Attempt to gain unauthorised access to our systems.</li>
              <li>Harass, abuse, or harm other users or staff.</li>
              <li>Use automated tools to scrape or extract data from the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, UK Pathway Hub shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">10. Governing Law</h2>
            <p>These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">11. Changes to These Terms</h2>
            <p>We reserve the right to update these terms at any time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">12. Contact Us</h2>
            <p>If you have questions about these terms, please contact us:</p>
            <ul className="list-none space-y-1">
              <li>Email: <a href="mailto:support@ukpathway.com" className="text-primary underline">support@ukpathway.com</a></li>
              <li>Phone: +44 20 1234 5678</li>
              <li>Address: London, United Kingdom</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
