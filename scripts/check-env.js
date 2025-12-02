// scripts/check-env.js
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ENCRYPTION_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CRON_SECRET',
  'NEXT_PUBLIC_APP_URL'
];

const optionalEnvVars = [
  'STRIPE_PRICE_MONTHLY',
  'STRIPE_PRICE_YEARLY',
  'SENTRY_DSN'
];

console.log('🔍 Checking environment variables...\n');

let allPassed = true;

// Check required variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ Missing: ${varName}`);
    allPassed = false;
  } else if (varName.includes('SECRET') || varName.includes('KEY')) {
    console.log(`✅ ${varName}: [Set] (${process.env[varName].length} chars)`);
  } else {
    console.log(`✅ ${varName}: ${process.env[varName]}`);
  }
});

console.log('\n📋 Optional variables:');
optionalEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`⚠️  Not set: ${varName}`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

// Special checks
console.log('\n🔐 Special checks:');
if (process.env.ENCRYPTION_SECRET_KEY && process.env.ENCRYPTION_SECRET_KEY.length !== 32) {
  console.log(`❌ ENCRYPTION_SECRET_KEY must be 32 characters, got ${process.env.ENCRYPTION_SECRET_KEY.length}`);
  allPassed = false;
}

if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('http')) {
  console.log(`⚠️  NEXT_PUBLIC_APP_URL should be a full URL starting with http:// or https://`);
}

console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('🎉 All required environment variables are set!');
  process.exit(0);
} else {
  console.log('❌ Some required environment variables are missing or invalid.');
  console.log('\n💡 Add missing variables to .env.local or Vercel project settings.');
  process.exit(1);
}