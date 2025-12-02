'use client';

import { useState } from 'react';

export default function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (feedback.trim()) {
      console.log('Feedback:', feedback);
      alert('Thank you! Feedback received.');
      setFeedback('');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 🌟 Prominent Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transform transition-all duration-200 z-50 flex items-center justify-center animate-pulse"
        title="Give Feedback"
      >
        <span className="text-3xl">Feedback</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform scale-100 transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-700">Send Feedback</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                Close
              </button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Bugs? Ideas? Suggestions? Let us know!"
              className="w-full p-4 border-2 border-purple-200 rounded-xl mb-6 h-40 resize-none focus:border-purple-500 focus:outline-none text-lg"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
            >
              Send Feedback
            </button>
          </div>
        </div>
      )}
    </>
  );
}