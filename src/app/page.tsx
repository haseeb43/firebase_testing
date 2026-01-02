'use client';

import LanguageSwitcher from '@/components/shared/language-switcher';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { BookCopyIcon, CheckIcon, FileTextIcon, LayoutDashboardIcon, MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { t } = useI18n();
  const { user, isUserLoading } = useUser();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-gray-900/90 text-white backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Image
            src="https://img1.wsimg.com/isteam/ip/68a287ad-de0d-4f97-9a41-b8ad07961366/Subtitle%20(6).jpg/:/rs=h:175,m"
            alt={t('app_title')}
            width={100}
            height={40}
            className="object-contain h-8 w-auto"
          />
          <span className="sr-only">{t('app_title')}</span>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            {t('features_title')}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            {t('pricing_title')}
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              {t('dashboard')}
            </Link>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden sm:flex">
            <LanguageSwitcher inHeader={true} />
          </div>
          {!isUserLoading && !user && (
            <>
              <Button asChild variant="outline" className="hidden lg:inline-flex">
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild className="hidden lg:inline-flex">
                <Link href="/signup">{t('signup')}</Link>
              </Button>
              <Button asChild variant="ghost" className="hidden lg:inline-flex">
                <Link href="/admin-login">{t('admin_login_title')}</Link>
              </Button>
            </>
          )}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Select a page to navigate to.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                {t('features_title')}
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium hover:underline underline-offset-4"
                prefetch={false}
              >
                {t('pricing_title')}
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  {t('dashboard')}
                </Link>
              )}
              {!user && (
                <div className="flex flex-col gap-4">
                  <Button asChild variant="outline">
                    <Link href="/login">{t('login')}</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">{t('signup')}</Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/admin-login">{t('admin_login_title')}</Link>
                  </Button>
                </div>
              )}
              <div className="pt-4">
                <LanguageSwitcher />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1">
        <section className="relative w-full pt-24 md:pt-32 lg:pt-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t('hero_title')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('hero_subtitle')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">{t('start_free_trial')}</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last">
                <iframe
                  className="h-full w-full object-cover"
                  src="https://www.youtube.com/embed/b_WxGgT6-Lg?autoplay=1&mute=1&loop=1&playlist=b_WxGgT6-Lg&controls=0&showinfo=0&modestbranding=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t('features_title')}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('features_subtitle')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <LayoutDashboardIcon className="mx-auto h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">{t('feature_dashboard_title')}</h3>
                <p className="text-muted-foreground">{t('feature_dashboard_description')}</p>
              </div>
              <div className="grid gap-1 text-center">
                <FileTextIcon className="mx-auto h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">{t('feature_invoicing_title')}</h3>
                <p className="text-muted-foreground">{t('feature_invoicing_description')}</p>
              </div>
              <div className="grid gap-1 text-center">
                <BookCopyIcon className="mx-auto h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">{t('feature_tracking_title')}</h3>
                <p className="text-muted-foreground">{t('feature_tracking_description')}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                {t('pricing_title')}
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('pricing_subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('plan_free_title')}</CardTitle>
                  <CardDescription>{t('plan_free_description')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="text-4xl font-bold">
                    {t('plan_free_price')}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      {t('plan_free_price_suffix')}
                    </span>
                  </div>
                  <ul className="grid gap-2 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_free_feature_1')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_free_feature_2')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_free_feature_3')}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/signup">{t('get_started_free')}</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <CardTitle>{t('plan_title')}</CardTitle>
                  <CardDescription>{t('plan_description')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="text-4xl font-bold">
                    1.990{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      {t('plan_price_suffix')}
                    </span>
                  </div>
                  <ul className="grid gap-2 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      {t('plan_feature_1')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      {t('plan_feature_2')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-primary" />
                      {t('plan_feature_3')}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/signup">{t('get_started_now')}</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('plan_enterprise_title')}</CardTitle>
                  <CardDescription>{t('plan_enterprise_description')}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="text-4xl font-bold">
                    {t('plan_enterprise_price')}{' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      {t('plan_price_suffix')}
                    </span>
                  </div>
                  <ul className="grid gap-2 text-left text-sm">
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_enterprise_feature_1')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_enterprise_feature_2')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_enterprise_feature_3')}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      {t('plan_enterprise_feature_4')}
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link href="/signup">{t('contact_sales')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          leslogistic.com &copy; 2026 All rights reserved.
        </p>
      </footer>
    </div>
  );
}
