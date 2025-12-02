// app/legal/refund/page.tsx
export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Refund Policy
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Subscription Refunds</h2>
            <p className="text-gray-600">
              All subscription fees are non-refundable except as required by law. 
              You may cancel your subscription at any time, but no refunds will be provided 
              for partial months or unused portions of your subscription.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Issues</h2>
            <p className="text-gray-600">
              If you experience technical issues that prevent you from using our service, 
              please contact our support team at support@yourdomain.com. We will work 
              diligently to resolve any issues you encounter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cancellation</h2>
            <p className="text-gray-600">
              You may cancel your subscription at any time through your account dashboard. 
              Upon cancellation, you will continue to have access to the service until 
              the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contact for Refund Requests</h2>
            <p className="text-gray-600">
              For refund inquiries, please contact: billing@yourdomain.com
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please include your account email and transaction details in your request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Changes to This Policy</h2>
            <p className="text-gray-600">
              We reserve the right to modify this refund policy at any time. 
              Changes will be effective immediately upon posting to our website.
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