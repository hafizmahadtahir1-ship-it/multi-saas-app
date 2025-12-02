// components/CookieConsent.tsx
'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <p className="text-sm">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            <a href="/legal/privacy" className="underline ml-2 hover:text-blue-300">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}