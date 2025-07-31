import type { MiddlewareHandler } from 'hono';
import { CustomError, TOO_MANY_REQUESTS_ERROR_MSG } from '../utils/errors.js';
import { StatusCodes } from "http-status-codes";
import type { RateLimitOptions } from '../utils/validation.js';

export const rateLimit = ({ maxRequests, windowMs, message }: RateLimitOptions): MiddlewareHandler => {
  const rateLimits = new Map<string, { count: number; expires: number }>();

  return async (c, next) => {
    const ip = (c.req.header('x-forwarded-for') ?? c.req.header('remote-addr')) ?? 'unknown';
    const now = Date.now();

    if (!rateLimits.has(ip)) {
      rateLimits.set(ip, { count: 1, expires: now + windowMs });
    } else {
      const data = rateLimits.get(ip)!;
      if (now > data.expires) {
        data.count = 1;
        data.expires = now + windowMs;
      } else if (data.count >= maxRequests) {
        throw new CustomError(TOO_MANY_REQUESTS_ERROR_MSG, StatusCodes.TOO_MANY_REQUESTS);
      } else {
        data.count += 1;
      }
    }

    await next();
  };
};
