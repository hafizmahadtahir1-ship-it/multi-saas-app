// pages/api/sentry-example-api.ts
import type { NextApiRequest, NextApiResponse } from 'next';

class SentryExampleAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

// A faulty API route to test Sentry's error monitoring
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  throw new SentryExampleAPIError("This error is raised on the backend called by the example page.");
  // This line will never be reached due to the throw, but kept for reference
  // res.status(200).json({ name: "John Doe" });
}