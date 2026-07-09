import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  signInSchema,
  signUpSchema,
} from './auth.schema';

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('a@b.com').success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('accepts a strong password', () => {
    expect(passwordSchema.safeParse('Abcdef1!').success).toBe(true);
  });

  it('rejects too short password', () => {
    expect(passwordSchema.safeParse('Ab1!').success).toBe(false);
  });

  it('rejects password without letter', () => {
    expect(passwordSchema.safeParse('12345678!').success).toBe(false);
  });

  it('rejects password without digit', () => {
    expect(passwordSchema.safeParse('abcdefg!').success).toBe(false);
  });

  it('rejects password without special character', () => {
    expect(passwordSchema.safeParse('abcdefg1').success).toBe(false);
  });
});

describe('signInSchema', () => {
  it('accepts valid sign in data', () => {
    const result = signInSchema.safeParse({
      email: 'a@b.com',
      password: 'x',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = signInSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('signUpSchema', () => {
  it('accepts matching passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'a@b.com',
      password: 'Abcdef1!',
      confirmPassword: 'Abcdef1!',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signUpSchema.safeParse({
      email: 'a@b.com',
      password: 'Abcdef1!',
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });
});
