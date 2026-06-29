import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignInForm() {
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In Form</CardTitle>
        <CardDescription>
          Please, insert your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Your email</FieldLabel>
              <Input
                id="email"
                placeholder="example@gmail.com"
                autoComplete="on"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                placeholder="**********"
                autoComplete="off"
              />
            </Field>
          </FieldGroup>
          <Button type="submit" form="form-rhf-demo" className="mt-3">
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
