// app/legal/cookie/page.tsx
export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Cookie Policy
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-600">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences 
              and enabling certain functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for basic site functionality, 
                such as authentication and security.
              </li>
              <li>
                <strong>Preference Cookies:</strong> Remember your settings and preferences.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand how visitors interact 
                with our website.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              We use third-party services that may set cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Stripe for payment processing</li>
              <li>Supabase for authentication and database</li>
              <li>Vercel for hosting and analytics</li>
              <li>Slack (when you integrate your workspace)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-600">
              You can control and/or delete cookies as you wish. You can delete all cookies 
              that are already on your computer and set most browsers to prevent them from 
              being placed. However, if you do this, you may have to manually adjust some 
              preferences every time you visit our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Contact Us</h2>
            <p className="text-gray-600">
              For questions about our use of cookies, contact: privacy@yourdomain.com
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