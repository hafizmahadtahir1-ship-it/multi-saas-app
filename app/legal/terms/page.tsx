// app/legal/terms/page.tsx
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using Multi-Micro SaaS, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
            <p className="text-gray-600">
              Multi-Micro SaaS provides template-based automation tools for teams, including 
              async standups, retrospectives, and other workflow automation templates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate registration information</li>
              <li>Maintain security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in unauthorized use of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Billing and Subscription</h2>
            <p className="text-gray-600">
              Subscription fees are billed in advance on a monthly or yearly basis. 
              All fees are non-refundable except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Termination</h2>
            <p className="text-gray-600">
              We reserve the right to terminate or suspend access to our Service immediately, 
              without prior notice or liability, for any reason.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}