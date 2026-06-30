'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';
import { useAuth } from '../useAuth';
import { Controller, useForm } from 'react-hook-form';
import {
  SignUpFields,
  signUpSchema,
  SignInFields,
  signInSchema,
} from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export default function AuthForm({ type }: { type: 'Sign In' | 'Sign Up' }) {
  const router = useRouter();
  const { isAuthenticated, signUp, isLoading, signIn } = useAuth();

  const baseDefaults = { email: '', password: '' };
  const defaultValues =
    type === 'Sign Up'
      ? { ...baseDefaults, confirmPassword: '' }
      : baseDefaults;

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const form = useForm<SignUpFields | SignInFields>({
    resolver: zodResolver(type === 'Sign In' ? signInSchema : signUpSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: SignUpFields | SignInFields) {
    const authError =
      type === 'Sign In'
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

    if (authError) {
      toast.error(authError);
      return;
    }

    toast.success(type === 'Sign In' ? 'Welcome back' : 'Account created');
    form.reset();
  }

  if (isLoading || isAuthenticated) {
    return <Spinner className="size-8" />;
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>{type} Form</CardTitle>
        <CardDescription>
          {type === 'Sign In'
            ? 'Please, insert your email and password'
            : 'Please, insert your email, password, then confirm your password'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Your email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@gmail.com"
                    autoComplete="on"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    id="password"
                    placeholder="**********"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {type === 'Sign Up' && (
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="confirmPassword"
                      placeholder="**********"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
          <Button
            disabled={!form.formState.isValid}
            type="submit"
            form="auth-form"
            className="mt-3"
          >
            Submit
          </Button>
        </form>
      </CardContent>
      {type === 'Sign In' ? (
        <CardFooter>
          Don&apos;t have an account yet?{' '}
          <Link
            href="/sign-up"
            className="text-m ml-3 flex items-center space-x-2 text-lime-800 underline"
          >
            Sign up
          </Link>
        </CardFooter>
      ) : (
        <CardFooter>
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-m ml-3 flex items-center space-x-2 text-lime-800 underline"
          >
            Sign in
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
