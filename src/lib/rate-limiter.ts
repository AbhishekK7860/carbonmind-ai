export class RateLimiter {
  private cache: Map<string, { count: number; expiresAt: number }>;
  private limit: number;
  private windowMs: number;

  constructor(limit: number, windowMs: number) {
    this.cache = new Map();
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Check if the identifier (e.g. IP or User ID) has exceeded the rate limit.
   * Returns true if allowed, false if rate-limited.
   */
  check(identifier: string): boolean {
    const now = Date.now();
    const record = this.cache.get(identifier);

    if (!record) {
      this.cache.set(identifier, { count: 1, expiresAt: now + this.windowMs });
      return true;
    }

    if (now > record.expiresAt) {
      this.cache.set(identifier, { count: 1, expiresAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.limit) {
      return false;
    }

    record.count += 1;
    this.cache.set(identifier, record);
    return true;
  }
}

// Configured Limits:
// Auth: 10 attempts per minute per IP (to prevent brute force)
export const authRateLimiter = new RateLimiter(10, 60 * 1000);

// Gemini API: 5 requests per minute per User (to prevent quota abuse)
export const aiRateLimiter = new RateLimiter(5, 60 * 1000);
