
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import { useEffect } from "react";
import Image from "next/image";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  logoUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  kennitala: z.string().regex(/^\d{10}$/, { message: "Kennitala must be 10 digits." }),
  vatNumber: z.string().min(2, "VAT number is required.").or(z.literal('')),
  address: z.string().min(2, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  postalCode: z.string().regex(/^\d{3}$/, { message: "Postal code must be 3 digits." }),
  bank: z.string().min(4, { message: "Bank number must be 4 digits" }),
  branch: z.string().min(2, { message: "Branch (hb) must be 2 digits" }),
  accountNumber: z.string().min(6, { message: "Account number must be at least 6 digits" }),
  vatRate: z.coerce.number().min(0).max(100),
  nextInvoiceNumber: z.coerce.number().min(1, "Next invoice number must be at least 1."),
  lastInvoiceYear: z.coerce.number().min(2000, "Year must be valid."),
});

export default function SettingsForm() {
  const { toast } = useToast();
  const { settings, setSettings, isLoading } = useSettings();
  const { t } = useI18n();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });
  
  useEffect(() => {
    if (!isLoading) {
      form.reset(settings);
    }
  }, [isLoading, settings, form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
    toast({
      title: t('settings_updated'),
      variant: 'default',
    });
  }

  const logoUrl = form.watch("logoUrl");

  if (isLoading) {
      return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('company_details')}</CardTitle>
            <CardDescription>{t('settings_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('company_name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} />
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
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vat_number')}</FormLabel>
                      <FormControl>
                        <Input placeholder="IS123456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('logo_url')}</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2 flex flex-col items-center justify-center">
                 <FormLabel>Logo Preview</FormLabel>
                 <div className="w-32 h-32 rounded-lg border border-dashed flex items-center justify-center bg-muted">
                    {logoUrl ? (
                         <Image src={logoUrl} alt="Logo Preview" width={128} height={128} className="rounded-lg object-contain"/>
                    ) : (
                        <span className="text-sm text-muted-foreground">No Logo</span>
                    )}
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t('address_details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Laugavegur 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('postal_code')}</FormLabel>
                          <FormControl>
                            <Input placeholder="101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('city')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Reykjavík" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('payment_information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <FormField
                      control={form.control}
                      name="bank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('bank')}</FormLabel>
                          <FormControl>
                            <Input placeholder="0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('branch')}</FormLabel>
                          <FormControl>
                            <Input placeholder="26" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('account_number')}</FormLabel>
                          <FormControl>
                            <Input placeholder="123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t('tax_and_invoice_settings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="vatRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('vat_rate')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Input type="number" placeholder="24" {...field} className="pr-8" />
                            <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextInvoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('next_invoice_number')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastInvoiceYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('last_invoice_year')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={String(new Date().getFullYear())} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
        </Card>

        <Button type="submit">{t('save_settings')}</Button>
      </form>
    </Form>
  );
}
