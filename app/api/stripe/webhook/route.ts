// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClientAsync } from '@/lib/supabase';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log(`🔔 Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancel(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: any) {
  const supabase = await createServerClientAsync();
  const customerId = subscription.customer;
  
  // Find team by Stripe customer ID
  const { data: team, error } = await supabase
    .from('teams')
    .select('id, plan_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !team) {
    console.error('Team not found for customer:', customerId);
    return;
  }

  // Update team plan based on subscription
  const planId = subscription.items.data[0]?.price?.metadata?.plan_id || 'pro';
  
  await supabase
    .from('teams')
    .update({ 
      plan_id: planId,
      updated_at: new Date().toISOString()
    })
    .eq('id', team.id);

  console.log(`✅ Team ${team.id} plan updated to ${planId}`);
}

async function handleSubscriptionCancel(subscription: any) {
  const supabase = await createServerClientAsync();
  const customerId = subscription.customer;
  
  await supabase
    .from('teams')
    .update({ 
      plan_id: 'free',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_customer_id', customerId);

  console.log(`📉 Team downgraded to free plan for customer: ${customerId}`);
}

async function handlePaymentSuccess(invoice: any) {
  console.log(`✅ Payment succeeded for invoice: ${invoice.id}`);
  // Can store invoice data or send email
}

async function handlePaymentFailed(invoice: any) {
  console.log(`❌ Payment failed for invoice: ${invoice.id}`);
  // Can notify team owners
}