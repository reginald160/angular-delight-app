import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
  const lastUpdated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/auth?mode=signup">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign Up
          </Button>
        </Link>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to UK Pathway Hub ("we", "us", "our"). These Terms and Conditions govern your use of our platform and
              our career support services. By accessing or using UK Pathway Hub, you agree to be bound by these terms in
              accordance with the laws of England and Wales.
            </p>
            <p>
              UK Pathway Hub provides professional career support and job application assistance services, including CV
              optimisation, job search support, application preparation and submission (where authorised), and interview
              preparation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By registering, you confirm that all information you provide is
              accurate, up to date, and that you have the legal right to use our platform and enter into this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">3. Services Provided</h2>
            <p>UK Pathway Hub may provide some or all of the following services depending on your plan:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>CV & Profile Optimisation:</strong> CV review/rewrite, ATS keyword optimisation, and optional LinkedIn profile guidance.
              </li>
              <li>
                <strong>Job Search Support:</strong> Role shortlisting based on your preferences and suitability.
              </li>
              <li>
                <strong>Job Application Assistance:</strong> Tailored cover letters, application form completion support, and application tracking.
              </li>
              <li>
                <strong>Managed Job Applications (where authorised):</strong> Submitting applications on your behalf for roles you approve.
              </li>
              <li>
                <strong>Interview Preparation:</strong> Coaching, mock interviews, and interview strategy support.
              </li>
            </ul>

            <p className="mt-4">
              <strong>No guarantees:</strong> We provide professional support services only. We do not guarantee interviews, job offers, or employment outcomes.
              Hiring decisions are made solely by employers and are outside our control.
            </p>

            <p className="mt-4">
              <strong>Not legal or immigration advice:</strong> We do not provide immigration advice, legal advice, or regulated representation services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorised use
              of your account. We may suspend or terminate accounts that violate these terms or pose a security risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">5. Your Responsibilities</h2>
            <p>You agree that you will:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information, including qualifications, work history, and right-to-work status where relevant.</li>
              <li>Review and approve the roles we shortlist and any application materials before submission (where approval is requested).</li>
              <li>Not ask us to submit false or misleading information to employers or third-party platforms.</li>
              <li>Respond promptly when we request clarifications needed to complete an application.</li>
            </ul>
            <p className="mt-4">
              If you provide incorrect information or ask us to submit misleading information, we may refuse the request and/or suspend your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">6. Authorisation to Submit Applications</h2>
            <p>
              If your plan includes managed applications, you authorise us to prepare and submit job applications on your behalf <strong>only</strong> for roles
              you have approved, using the information and documents you provide. You remain responsible for ensuring the accuracy of your information.
            </p>
            <p>
              Some employers and application platforms may require you to create an account, verify an email address, complete identity checks, or accept
              their own terms. In such cases, you agree to cooperate and complete any steps that must legally be done by you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">7. Payments & Subscriptions</h2>
            <p>Certain features of UK Pathway Hub require a paid subscription or one-off fee. By purchasing, you agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are displayed in GBP (£) and include VAT where applicable.</li>
              <li>Payments are processed securely through our third-party payment provider (Stripe).</li>
              <li>Subscriptions auto-renew unless cancelled before the renewal date.</li>
              <li>You may cancel your subscription at any time through your account settings (cancellation takes effect at the end of the billing period unless stated otherwise).</li>
              <li>Plan limits (e.g., number of applications per month) are shown at checkout and/or in your account dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">8. Refund Policy</h2>
            <p>We aim to provide a fair refund policy while recognising that our services involve human time and delivered work.</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>14-Day Cooling-Off Period:</strong> Under the UK Consumer Contracts Regulations 2013, you may have the right to cancel within 14 days.
                If you request us to start providing services during the cooling-off period, you agree you may be charged for the proportion of services already delivered.
              </li>
              <li>
                <strong>No refunds once work is delivered:</strong> Where we have completed CV rewrites, cover letters, interview sessions, or submitted applications,
                we may decline refunds for work already performed.
              </li>
              <li>
                <strong>Subscription cancellations:</strong> If you cancel after renewal, access remains until the end of the billing period. We do not provide pro-rata refunds
                for unused time unless required by law or in exceptional circumstances.
              </li>
              <li>
                <strong>Technical issues:</strong> If a technical issue prevents you from using the platform, contact support. We may offer a credit, partial refund, or extension at our discretion.
              </li>
              <li>
                <strong>Chargebacks and disputes:</strong> If you raise a payment dispute, we may suspend your account while the dispute is investigated.
              </li>
            </ul>

            <p className="mt-4">
              To request a refund, contact us at{' '}
              <a href="mailto:support@ukpathway.com" className="text-primary underline">
                support@ukpathway.com
              </a>{' '}
              with your account details and reason for the request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">9. Intellectual Property</h2>
            <p>
              All platform content, branding, and software are owned by us or our licensors and are protected by applicable intellectual property laws.
              You may not reproduce, distribute, or create derivative works without our prior written consent.
            </p>
            <p className="mt-4">
              <strong>Your documents:</strong> You retain ownership of your CV and personal documents. By uploading content, you grant us a limited licence to use
              it solely to deliver the services you have requested.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">10. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for any unlawful purpose.</li>
              <li>Submit false, misleading, or fraudulent information.</li>
              <li>Attempt to gain unauthorised access to our systems.</li>
              <li>Harass, abuse, or harm other users or staff.</li>
              <li>Use automated tools to scrape or extract data from the platform.</li>
              <li>Upload malware, harmful code, or content that infringes someone else’s rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, UK Pathway Hub shall not be liable for any indirect, incidental, special, or consequential damages
              arising from your use of the platform or services, including lost profits, lost opportunities, or loss of employment.
            </p>
            <p>
              Our total liability for any claim shall not exceed the amount paid by you in the 12 months preceding the claim.
              Nothing in these terms limits liability that cannot be excluded under law (including for fraud or death/personal injury caused by negligence).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">12. Suspension & Termination</h2>
            <p>We may suspend or terminate your account if you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate these Terms;</li>
              <li>Provide fraudulent information or request misrepresentation;</li>
              <li>Abuse staff or misuse the platform;</li>
              <li>Engage in activity that creates security or legal risk.</li>
            </ul>
            <p className="mt-4">
              If your account is terminated for cause, refunds may be refused for services already delivered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">13. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">14. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. We will notify registered users of material changes via email or in-app notice.
              Continued use of the platform after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold text-foreground">15. Contact Us</h2>
            <p>If you have questions about these terms, please contact us:</p>
            <ul className="list-none space-y-1">
              <li>
                Email:{' '}
                <a href="mailto:support@ukpathway.com" className="text-primary underline">
                  support@ukpathway.com
                </a>
              </li>
              <li>Phone: +44 7919 785936</li>
              <li>Address: London, United Kingdom</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}