import * as Sentry from "@sentry/nextjs";

export function logError(error: any, context?: string) {
  console.error(context ? `${context}:` : "", error);
  Sentry.captureException(error);
}

export function logInfo(message: string, context?: string) {
  console.log(context ? `${context}:` : "", message);
}