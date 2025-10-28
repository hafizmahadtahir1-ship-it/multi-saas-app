// lib/rateLimit.ts
type Bucket = { tokens: number; last: number };
const BUCKETS = new Map<string, Bucket>();

const MAX_PER_MINUTE = 60; // change as needed
const REFILL_INTERVAL = 60_000; // 1 minute in ms

export async function rateLimit(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon') as string;
  const now = Date.now();
  let b = BUCKETS.get(ip);
  if (!b) {
    b = { tokens: MAX_PER_MINUTE, last: now };
    BUCKETS.set(ip, b);
  }
  // refill tokens
  const elapsed = now - b.last;
  if (elapsed > REFILL_INTERVAL) {
    b.tokens = MAX_PER_MINUTE;
    b.last = now;
  }

  if (b.tokens <= 0) {
    const res = new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    throw res; // for Next.js API route, catch and return; or return res directly if using edge
  }

  b.tokens -= 1;
  b.last = now;
  // continue (no return needed)
}