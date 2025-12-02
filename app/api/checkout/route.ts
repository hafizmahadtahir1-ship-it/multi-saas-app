// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithTeam } from '@/lib/auth-utils';
import { createCheckoutSession } from '@/lib/services/stripe-customer';

// Stripe Price IDs - SET THESE IN YOUR STRIPE DASHBOARD
const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_pro',
  yearly: process.env.STRIPE_PRICE_YEARLY || 'price_yearly_pro'
};

export async function POST(request: NextRequest) {
  try {
    const { user, team } = await getCurrentUserWithTeam();
    const { priceId, billingPeriod = 'monthly' } = await request.json();

    // Determine which price to use
    const selectedPriceId = priceId || 
      (billingPeriod === 'yearly' ? STRIPE_PRICES.yearly : STRIPE_PRICES.monthly);

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=canceled`;

    const checkoutUrl = await createCheckoutSession(
      team.team_id,
      selectedPriceId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}