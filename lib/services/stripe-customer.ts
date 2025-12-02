// lib/services/stripe-customer.ts
import { stripe } from '@/lib/stripe';
import { createServerClientAsync } from '@/lib/supabase';

export async function getOrCreateStripeCustomer(teamId: string, email?: string) {
  const supabase = await createServerClientAsync();
  
  // Check if team already has Stripe customer
  const { data: team, error } = await supabase
    .from('teams')
    .select('id, name, stripe_customer_id')
    .eq('id', teamId)
    .single();

  if (error) throw new Error(`Team not found: ${error.message}`);

  // Return existing customer ID
  if (team.stripe_customer_id) {
    return team.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: email || `team-${teamId}@example.com`,
    name: team.name,
    metadata: {
      team_id: teamId,
      created_at: new Date().toISOString()
    }
  });

  // Update team with Stripe customer ID
  await supabase
    .from('teams')
    .update({ 
      stripe_customer_id: customer.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', teamId);

  console.log(`✅ Created Stripe customer ${customer.id} for team ${team.name}`);
  return customer.id;
}

export async function createCheckoutSession(
  teamId: string, 
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(teamId);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        team_id: teamId
      }
    }
  });

  return session.url;
}