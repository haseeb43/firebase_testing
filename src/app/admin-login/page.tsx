'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDoc, doc as firestoreDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function AdminLoginForm() {
  const { t } = useI18n();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isUserLoading, userError } = useUser();

  // Dev logging: surface auth and permission-related state for debugging
  useEffect(() => {
    console.log('[AdminLogin] auth.currentUser:', auth.currentUser ?? null);
    console.log('[AdminLogin] useUser -> user:', user ?? null, 'isUserLoading:', isUserLoading, 'userError:', userError?.message ?? null);
  }, [auth, user, isUserLoading, userError]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let description = 'An unknown error occurred.';
      if (error === 'not_logged_in') description = 'You must be logged in as an administrator.';
      if (error === 'not_admin') description = 'You are not an administrator.';
      if (error === 'deactivated') description = 'This account has been deactivated.';

      toast({
        title: 'Access Denied',
        description: description,
        variant: 'destructive',
      });
      // Clear the error from the URL
      router.replace('/admin-login', { scroll: false });
    }
  }, [searchParams, toast, router]);

  useEffect(() => {
    // If a user is already logged in, the admin layout will handle
    // role verification and redirection.
    if (!isUserLoading && user) {
      router.push('/admin/users');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Step 1: Authenticate (get credentials)
      const cred = await signInWithEmailAndPassword(auth, values.email, values.password);
      const uid = cred.user?.uid;

      if (!uid) {
        throw new Error('Authentication succeeded but no user id returned');
      }

      // Step 2: Fetch Firestore user document
      const userSnap = await getDoc(firestoreDoc(firestore, 'users', uid));
      if (!userSnap.exists()) {
        await signOut(auth);
        toast({ title: 'Login Failed', description: 'User profile not found', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      const userData: any = userSnap.data();

      // Step 3: Enforce active status (status or legacy accessAllowed)
      const isActive = userData.status ? userData.status === 'active' : (userData.accessAllowed !== false);
      if (!isActive) {
        await signOut(auth);
        toast({ title: 'Login Failed', description: 'This account has been deactivated', variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      // Step 4: OK -> redirect to admin area. AdminLayout will still verify roles.
      router.push('/admin/users');
    } catch (error: any) {
      console.error('[AdminLogin] signIn error:', error);
      // Handle authentication errors (wrong password, user not found, etc.)
      toast({
        title: 'Login Failed',
        description: 'Please check your email and password.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues('email');
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address to reset your password.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Password Reset Email Sent',
        description:
          'If an account exists for this email, a password reset link has been sent to it.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Show a loading screen if we are still checking for an existing session
  // or if a user exists and we are waiting for the redirect to happen.
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="https://img1.wsimg.com/isteam/ip/68a287ad-de0d-4f97-9a41-b8ad07961366/Subtitle%20(6).jpg/:/rs=h:175,m"
              alt="Welcome"
              width={175}
              height={175}
              className="object-contain"
            />
          </div>
          <CardDescription>{t('admin_login_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t('password')}</FormLabel>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-xs"
                        onClick={handlePasswordReset}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="safe123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : t('login')}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline">
              {t('back_to_home')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminLoginPageWithSearchParams() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div>Loading...</div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

export default function AdminLoginPage() {
  return <AdminLoginPageWithSearchParams />;
}
