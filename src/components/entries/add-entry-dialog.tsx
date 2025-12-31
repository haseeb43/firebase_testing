'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { WithId } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const formSchema = z.object({
  description: z.string().min(2, { message: 'Description must be at least 2 characters.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  type: z.enum(['sale', 'expense'], { required_error: 'You need to select a type.' }),
  vatRate: z.coerce.number({ required_error: 'You need to select a VAT rate.' }),
  paymentMethod: z.enum(['cash', 'card', 'bank'], {
    required_error: 'You need to select a payment method.',
  }),
});

type AddEntryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: WithId<Transaction>;
};

export default function AddEntryDialog({ open, onOpenChange, transaction }: AddEntryDialogProps) {
  const { t } = useI18n();
  const { addTransaction, updateTransaction } = useTransactions();
  const { toast } = useToast();

  const isEditMode = !!transaction;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          description: transaction.description,
          category: transaction.category,
          amount: transaction.amount,
          type: transaction.type,
          vatRate: transaction.vatRate,
          paymentMethod: transaction.paymentMethod,
        }
      : {
          description: '',
          category: '',
          amount: 0,
          type: 'expense',
          vatRate: 24,
          paymentMethod: 'card',
        },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEditMode
          ? {
              description: transaction.description,
              category: transaction.category,
              amount: transaction.amount,
              type: transaction.type,
              vatRate: transaction.vatRate,
              paymentMethod: transaction.paymentMethod,
            }
          : {
              description: '',
              category: '',
              amount: 0,
              type: 'expense',
              vatRate: 24,
              paymentMethod: 'card',
            }
      );
    }
  }, [open, form, isEditMode, transaction]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditMode) {
      if (!transaction?.id) {
        console.error('Transaction ID is missing for update.');
        toast({
          title: 'Error',
          description: 'Could not update transaction because the ID is missing.',
          variant: 'destructive',
        });
        return;
      }
      updateTransaction({
        ...transaction,
        ...values,
        id: transaction.id, // Explicitly include the ID
      });
      toast({ title: t('entry_updated') });
    } else {
      addTransaction(values);
      toast({ title: t('entry_added') });
    }
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('edit_entry') : t('add_new_entry')}</DialogTitle>
          <DialogDescription>
            {isEditMode ? t('edit_entry_description') : t('add_new_entry_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('description_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('category_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('amount')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('expense')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="sale" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('sale')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('payment_method')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="card" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('card')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('cash')}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="bank" />
                        </FormControl>
                        <FormLabel className="font-normal">{t('bank_transfer')}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vatRate"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t('vat_rate')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={String(field.value)}
                      className="flex space-x-4"
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit">{isEditMode ? t('save_changes') : t('save_entry')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
