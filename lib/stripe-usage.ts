// lib/stripe-usage.ts
import { stripe } from './stripe';

export async function reportUsageToStripe(
  customerId: string,
  subscriptionItemId: string,
  quantity: number
) {
  if (!customerId || !subscriptionItemId) {
    console.log('Skipping usage report - missing customer or subscription item');
    return;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    
    await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp,
        action: 'increment'
      }
    );

    console.log(`📊 Reported usage to Stripe: ${quantity} units for ${customerId}`);
  } catch (error: any) {
    console.error('❌ Failed to report usage to Stripe:', error.message);
  }
}