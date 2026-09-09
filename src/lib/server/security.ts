import crypto from 'node:crypto';

/**
 * Constant-time string comparison. Use for verifying passwords and any
 * other secret equality checks to avoid leaking timing information.
 */
export function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) {
    // Compare against a fixed-length dummy to keep timing uniform-ish.
    crypto.timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/**
 * Minimal in-memory sliding-window rate limiter keyed by an arbitrary
 * string (e.g. IP + route). Suitable for best-effort throttling on
 * serverless runtimes where each warm instance keeps its own map.
 *
 * Not a hard guarantee across cold starts / many instances — for strict
 * global limits use an external store (e.g. Upstash Redis). This still
 * meaningfully slows brute-force attempts on a single instance.
 */
export function createRateLimiter(options: {
  windowMs?: number;
  max?: number;
}) {
  const windowMs = options.windowMs ?? 60_000;
  const max = options.max ?? 10;

  const hits = new Map<string, { count: number; resetAt: number }>();

  function prune(now: number) {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }

  return {
    /**
     * Returns true when the key is allowed, false when it has exceeded
     * the limit within the current window.
     */
    allow(key: string): boolean {
      const now = Date.now();
      prune(now);

      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }

      if (entry.count >= max) {
        return false;
      }

      entry.count += 1;
      return true;
    },
  };
}

/** Best-effort client IP extraction from a Request. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
