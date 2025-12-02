import * as Sentry from '@sentry/nextjs';

// Required for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// Optional: Add any other client-side instrumentation here
// Example: Sentry.addTracingExtensions();