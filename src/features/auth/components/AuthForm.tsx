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
  createSignUpSchema,
  SignInFields,
  createSignInSchema,
} from '../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import styles from './AuthForm.module.css';

export default function AuthForm({ type }: { type: 'Sign In' | 'Sign Up' }) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    isAuthenticated,
    signUp,
    isLoading,
    signIn,
    sessionError,
    clearSessionError,
  } = useAuth();

  const baseDefaults = { email: '', password: '' };
  const defaultValues =
    type === 'Sign Up'
      ? { ...baseDefaults, confirmPassword: '' }
      : baseDefaults;

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(
        type === 'Sign In'
          ? t('auth.toast.welcomeBack')
          : t('auth.toast.accountCreated'),
      );
      router.replace('/');
    }
  }, [isAuthenticated, router, type, t]);

  useEffect(() => {
    if (!sessionError) return;
    toast.error(t(sessionError), { position: 'top-center' });
    clearSessionError();
  }, [sessionError, clearSessionError, t]);

  const schema = useMemo(
    () => (type === 'Sign In' ? createSignInSchema(t) : createSignUpSchema(t)),
    [type, t],
  );

  const form = useForm<SignUpFields | SignInFields>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: SignUpFields | SignInFields) {
    const authError =
      type === 'Sign In'
        ? await signIn(data.email, data.password)
        : await signUp(data.email, data.password);

    if (authError) {
      toast.error(t(authError), { position: 'top-center' });
      return;
    }

    form.reset();
  }

  if (isLoading) {
    return <Spinner className="size-8" />;
  }
  if (isAuthenticated) {
    return null;
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className={styles.form}>
      <Card>
        <CardHeader>
          <CardTitle>
            {type === 'Sign In'
              ? t('auth.form.signInTitle')
              : t('auth.form.signUpTitle')}
          </CardTitle>
          <CardDescription>
            {type === 'Sign In'
              ? t('auth.form.signInSubtitle')
              : t('auth.form.signUpSubtitle')}
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
                    <FieldLabel htmlFor="email">
                      {t('auth.form.emailLabel')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={t('auth.form.emailPlaceholder')}
                      autoComplete="email"
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
                    <FieldLabel htmlFor="password">
                      {t('auth.form.passwordLabel')}
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id="password"
                      placeholder="**********"
                      autoComplete={
                        type === 'Sign In' ? 'current-password' : 'new-password'
                      }
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
                        {t('auth.form.confirmPasswordLabel')}
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="confirmPassword"
                        placeholder="**********"
                        autoComplete="new-password"
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
              disabled={!form.formState.isValid || isSubmitting}
              type="submit"
              form="auth-form"
              className={styles.form__submit}
            >
              {isSubmitting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  {t('auth.form.submitting')}
                </>
              ) : (
                <>
                  {type === 'Sign In' ? (
                    <LogIn data-icon="inline-start" />
                  ) : (
                    <UserPlus data-icon="inline-start" />
                  )}
                  {t('auth.form.submit')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        {type === 'Sign In' ? (
          <CardFooter>
            {t('auth.form.noAccount')}{' '}
            <Link href="/sign-up" className={styles.form__switch_link}>
              {t('auth.form.signUpLink')}
              <ArrowRight className="size-4" />
            </Link>
          </CardFooter>
        ) : (
          <CardFooter>
            {t('auth.form.hasAccount')}{' '}
            <Link href="/sign-in" className={styles.form__switch_link}>
              {t('auth.form.signInLink')}
              <ArrowRight className="size-4" />
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
