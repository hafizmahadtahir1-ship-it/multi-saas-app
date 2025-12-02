// lib/env-check.ts
export function checkRequiredEnvVars() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ENCRYPTION_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    } else {
      console.warn('⚠️ Running in development with missing env vars');
    }
  }

  // Check specific requirements
  if (process.env.ENCRYPTION_SECRET_KEY && process.env.ENCRYPTION_SECRET_KEY.length !== 32) {
    const error = 'ENCRYPTION_SECRET_KEY must be exactly 32 characters';
    if (process.env.NODE_ENV === 'production') throw new Error(error);
    console.warn(`⚠️ ${error}`);
  }

  return missing.length === 0;
}

// Run check on import in development
if (process.env.NODE_ENV !== 'production') {
  checkRequiredEnvVars();
}