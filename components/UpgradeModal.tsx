// components/UpgradeModal.tsx
import React, { useState } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("No checkout URL received. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pricing = {
    monthly: { price: 29, period: 'month', savings: '' },
    yearly: { price: 290, period: 'year', savings: 'Save 2 months' }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upgrade to Pro</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Get unlimited template runs, priority support, and advanced features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingPeriod === 'monthly' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  billingPeriod === 'yearly' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
          
          {/* Pricing Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-4xl font-bold text-gray-900">
                ${pricing[billingPeriod].price}
              </span>
              <span className="text-gray-600 ml-2">
                /{pricing[billingPeriod].period}
              </span>
            </div>
            {pricing[billingPeriod].savings && (
              <div className="text-center">
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {pricing[billingPeriod].savings}
                </span>
              </div>
            )}
          </div>
          
          {/* Features */}
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Unlimited template runs</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Priority support</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Advanced analytics</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-3">✓</span>
              <span>Team collaboration tools</span>
            </li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default UpgradeModal;