
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { useInvoices } from "@/hooks/use-invoices";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSettings } from "@/hooks/use-settings";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(0.01, "Quantity must be positive"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
  vatRate: z.coerce.number(),
});

const formSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters."),
  clientAddress: z.string().min(2, "Client address is required."),
  clientKennitala: z.string().regex(/^\d{10}$/, "Kennitala must be 10 digits."),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(itemSchema).min(1, "At least one item is required."),
});

export default function CreateInvoiceForm() {
  const { t } = useI18n();
  const { addInvoice } = useInvoices();
  const { settings } = useSettings();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientAddress: "",
      clientKennitala: "",
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      items: [{ description: "", quantity: 1, unitPrice: 0, vatRate: settings.vatRate }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subtotal = values.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      return sum + (itemTotal / (1 + item.vatRate / 100));
    }, 0);

    const totalAmount = values.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const vatAmount = totalAmount - subtotal;

    addInvoice({
      ...values,
      status: 'unpaid' as const,
      total: totalAmount,
      subtotal,
      vatAmount,
      items: values.items.map((item) => ({ ...item, id: crypto.randomUUID() })),
    });


    toast({
      title: t('invoice_created'),
    });
    router.push("/invoices");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('client_details')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('client_name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client_address')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('client_address_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientKennitala"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('client_kennitala')}</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('invoice_details')}</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('issue_date')}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('due_date')}</FormLabel>
                   <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('invoice_items')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-md relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                    <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('item_description')}</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Web Design Service" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('quantity')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('unit_price')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="10000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name={`items.${index}.vatRate`}
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>{t('vat_rate')}</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={(value) => field.onChange(Number(value))}
                            defaultValue={String(field.value)}
                            className="flex flex-wrap space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="24" />
                                </FormControl>
                                <FormLabel className="font-normal">24%</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="11" />
                                </FormControl>
                                <FormLabel className="font-normal">11%</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="0" />
                                </FormControl>
                                <FormLabel className="font-normal">0%</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="absolute top-2 right-2 h-7 w-7 sm:top-4 sm:right-4 sm:h-8 sm:w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ description: "", quantity: 1, unitPrice: 0, vatRate: settings.vatRate })}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> {t('add_item')}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/invoices')}>{t('cancel')}</Button>
            <Button type="submit">{t('save_invoice')}</Button>
        </div>
      </form>
    </Form>
  );
}
