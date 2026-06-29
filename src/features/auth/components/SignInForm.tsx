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
import { SignInFields, signInSchema } from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function SignInForm() {
  const { signIn } = useAuth();

  const form = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  function onSubmit(data: SignInFields) {
    signIn(data.email, data.password);
    form.reset();
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In Form</CardTitle>
        <CardDescription>
          Please, insert your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
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
          </FieldGroup>
          <Button type="submit" form="sign-in-form" className="mt-3">
            Submit
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        Don&apos;t have an account yet?{' '}
        <Link
          href="/sign-up"
          className="text-m ml-3 flex items-center space-x-2 text-lime-800 underline"
        >
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
}
