// app/legal/privacy/page.tsx
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Team and workspace information</li>
              <li>Template usage data</li>
              <li>Payment information (processed by Stripe)</li>
              <li>Communication records</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage trends</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational measures to protect your 
              personal data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Services</h2>
            <p className="text-gray-600">
              We use third-party services including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Supabase (database and authentication)</li>
              <li>Stripe (payment processing)</li>
              <li>Vercel (hosting and deployment)</li>
              <li>Slack (integration when you connect)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Rights</h2>
            <p className="text-gray-600">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              For privacy-related questions, contact: privacy@yourdomain.com
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