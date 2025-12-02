// pages/legal/contact.tsx
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Currently just simulate submission
    setSubmitted(true);
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      {submitted && <p className="mb-4 text-green-600">Message sent successfully!</p>}
      <form onSubmit={handleSubmit} className="max-w-md bg-white p-6 rounded shadow">
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2 font-semibold">Message</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;