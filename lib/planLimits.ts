// lib/planLimits.ts
export type PlanId = 'free' | 'pro';

export const PLANS: { [k in PlanId]: { id: PlanId; name: string; priceMonthlyUSD: number } } = {
  free: { id: 'free', name: 'Free', priceMonthlyUSD: 0 },
  pro: { id: 'pro', name: 'Pro', priceMonthlyUSD: 29 },
};

export const PLAN_LIMITS: { [k in PlanId]: { runsPerMonth: number } } = {
  free: { runsPerMonth: 100 }, // ✅ Increased from 1 to 100 for proper testing
  pro: { runsPerMonth: 1000000 }, // effectively unlimited for MVP
};

// Add env check for Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY missing - billing will not work');
}

export function getPlanLimit(planId: PlanId) {
  return PLAN_LIMITS[planId]?.runsPerMonth ?? 0;
}

/**
 * Check whether team can run one more execution given their plan and current monthly usage.
 * @param planId - team plan id
 * @param currentMonthUsage - integer count of runs used this billing month
 * @param runsToAdd - number of runs about to be consumed (default 1)
 * @returns { withinLimit: boolean, remaining: number }
 */
export function canConsumeRuns(
  planId: PlanId,
  currentMonthUsage: number,
  runsToAdd = 1
): { withinLimit: boolean; remaining: number } {
  const limit = getPlanLimit(planId);
  const remaining = Math.max(limit - currentMonthUsage, 0);
  return {
    withinLimit: remaining >= runsToAdd,
    remaining,
  };
}

/**
 * Helper message to show in UI when limit reached
 */
export function getUpgradeMessage(planId: PlanId) {
  if (planId === 'free') {
    return `Aap Free plan par ho. ${getPlanLimit('free')} runs/month limit hai. Upgrade karke zyada runs le sakte ho.`;
  }
  return `Aapka plan: ${PLANS[planId].name}.`;
}