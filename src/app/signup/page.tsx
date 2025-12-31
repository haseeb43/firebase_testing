'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, useFirestore } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from '@/hooks/use-toast';
import type { Plan, Role } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, User } from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    email: z.string().email(),
    kennitala: z.string().regex(/^\d{10}$/, { message: 'Kennitala must be 10 digits.' }),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
    plan: z.enum(['free', 'pro', 'enterprise'], { required_error: 'You need to select a plan.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const ADMIN_EMAIL = 'leslogistc@leslogistic.com';
const SUPER_ADMIN_EMAIL = 'superadmin@example.com';

export default function SignupPage() {
  const { t } = useI18n();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      kennitala: '',
      password: '',
      confirmPassword: '',
      plan: 'pro',
    },
  });

  const createUserDocument = async (
    user: User,
    plan: Plan,
    kennitala: string,
    roles: Role[] = []
  ) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      email: user.email,
      kennitala: kennitala,
      roles: roles,
      accessAllowed: true, // Grant access by default
      plan: plan,
      createdAt: serverTimestamp(),
    });
  };

  const createActivityLog = async (user: User, plan: Plan) => {
    try {
      const activityLogRef = collection(firestore, 'activityLogs');
      await addDoc(activityLogRef, {
        userId: user.uid,
        userEmail: user.email, // Storing email for easier lookup
        action: 'user_signup',
        timestamp: serverTimestamp(),
        details: {
          message: `New user signed up: ${user.email}`,
          plan: plan,
        },
      });
    } catch (error) {
      console.error('Error writing activity log:', error);
      // We don't block the signup process if logging fails, but we should log it.
    }
  };

  const handleSuccessfulSignup = (isAdmin: boolean) => {
    toast({
      title: 'Account Created',
      description: "You've been successfully signed up. You can now log in.",
    });
    auth.signOut();
    router.push(isAdmin ? '/admin-login' : '/login');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      let roles: Role[] = [];
      if (values.email === SUPER_ADMIN_EMAIL) roles = ['super_admin', 'admin'];
      else if (values.email === ADMIN_EMAIL) roles = ['admin'];

      await createUserDocument(user, values.plan, values.kennitala, roles);
      await createActivityLog(user, values.plan);

      handleSuccessfulSignup(roles.length > 0);
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('signup_welcome')}</CardTitle>
          <CardDescription>{t('signup_prompt')}</CardDescription>
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
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kennitala"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('kennitala')}</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
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
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t('select_a_plan')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="free" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('plan_free_title')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="pro" />
                          </FormControl>
                          <FormLabel className="font-normal">{t('plan_title')}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="enterprise" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t('plan_enterprise_title')}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t('signup')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t('already_have_account')}{' '}
            <Link href="/login" className="underline">
              {t('login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
