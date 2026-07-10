import { z } from 'zod';
import type { TFunction } from 'i18next';

export function createEmailSchema(t: TFunction) {
  return z.email(t('auth.errors.invalidEmail'));
}

export function createPasswordSchema(t: TFunction) {
  return z
    .string()
    .min(8, { message: t('auth.form.errors.passwordMinLength') })
    .refine((value) => /\p{L}/u.test(value), {
      message: t('auth.form.errors.passwordLetter'),
    })
    .refine((value) => /\p{N}/u.test(value), {
      message: t('auth.form.errors.passwordDigit'),
    })
    .refine((value) => /[^\p{L}\p{N}\s]/u.test(value), {
      message: t('auth.form.errors.passwordSpecial'),
    });
}

export function createSignInSchema(t: TFunction) {
  return z.object({
    email: createEmailSchema(t),
    password: z.string().min(1, t('auth.form.errors.passwordRequired')),
  });
}

export function createSignUpSchema(t: TFunction) {
  return z
    .object({
      email: createEmailSchema(t),
      password: createPasswordSchema(t),
      confirmPassword: z
        .string()
        .min(1, t('auth.form.errors.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.form.errors.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

export type SignInFields = z.infer<ReturnType<typeof createSignInSchema>>;
export type SignUpFields = z.infer<ReturnType<typeof createSignUpSchema>>;
