import { z } from 'zod';

export const emailSchema = z.email('Must be a valid email address');
export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must contain at least 8 characters' })
  .refine((value) => /\p{L}/u.test(value), {
    message: 'Password must contain at least one letter',
  })
  .refine((value) => /\p{N}/u.test(value), {
    message: 'Must contain at least one digit',
  })
  .refine((value) => /[^\p{L}\p{N}\s]/u.test(value), {
    message: 'Must contain at least one special character',
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords should match',
    path: ['confirmPassword'],
  });
export type SignInFields = z.infer<typeof signInSchema>;
export type SignUpFields = z.infer<typeof signUpSchema>;
