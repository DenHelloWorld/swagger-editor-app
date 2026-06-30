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
import Link from 'next/link';
import { useAuth } from '../useAuth';
import { Controller, useForm } from 'react-hook-form';
import { SignUpFields, signUpSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

export default function SignUpForm() {
  const router = useRouter();
  const { isAuthenticated, signUp, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, router]);

  const form = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data: SignUpFields) {
    const signUpError = await signUp(data.email, data.password);

    if (signUpError) {
      toast.error(signUpError);
      return;
    }

    toast.success('Account created');
    form.reset();
  }

  if (isLoading || isAuthenticated) {
    return <Spinner className="size-8" />;
  }
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign Up Form</CardTitle>
        <CardDescription>
          Please, insert your email, password, then confirm your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input
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

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
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
          </FieldGroup>
          <Button type="submit" form="sign-up-form" className="mt-3">
            Submit
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="text-m ml-3 flex items-center space-x-2 text-lime-800 underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
