import { ZodSchema, z } from 'zod';
import { PASSWORD_NOT_STRONG } from './errors.js';
import { passwordRegex } from './password.js';

// * This one is for the Rate Limit Middleware
export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

export const validate = <T>(
    schema: ZodSchema<T>,
    data: T
  ): { success: boolean; parsedData: T | Record<string, unknown> } => {
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, parsedData: parsedData.error.format() };
    }
    return { success: true, parsedData: parsedData.data };
  };


// All the schemas to validate body requests

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().regex(passwordRegex, PASSWORD_NOT_STRONG),
});

export const createTeamSchema = z.object({
  name: z.string()
});

export const newTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  userId: z.string().uuid()
})

export const createNewPackageSchema = z.object({
  name: z.string(), 
  description: z.string(),
  abi: z.record(z.any()),
  bytecode: z.string(),
  isPublic: z.boolean(),
  createdBy: z.string()
})

// * Here I created a conversion function for the isPublic query to become a boolean
export const convertToBoolean = (isPublic: string | undefined) => {
  if (isPublic !== undefined) return isPublic === 'true'
  return undefined
}

