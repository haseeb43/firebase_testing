
"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings } from "@/hooks/use-settings";
import { useI18n } from "@/hooks/use-i18n";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as TableFooterComponent } from "@/components/ui/table";
import { Building2, Printer } from "lucide-react";
import Link from "next/link";
import { useInvoices } from "@/hooks/use-invoices";

export default function InvoicePage() {
  const params = useParams();
  const { id } = params;
  const { settings, isLoading: settingsLoading } = useSettings();
  const { getInvoiceById, isLoading: invoicesLoading } = useInvoices();
  const { t } = useI18n();

  const invoice = getInvoiceById(id as string);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(amount);
  };
  
  const formatDate = (date: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('is-IS', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const handlePrint = () => {
    window.print();
  };

  if (settingsLoading || invoicesLoading) {
    return <div>Loading...</div>;
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  const subtotal = invoice.subtotal;
  const vatAmount = invoice.vatAmount;
  const grandTotal = invoice.total;

  const vatBreakdown: { [key: number]: { base: number, vat: number } } = invoice.items.reduce((acc, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemSubtotal = itemTotal / (1 + item.vatRate / 100);
    const itemVat = itemTotal - itemSubtotal;
    
    if (!acc[item.vatRate]) {
      acc[item.vatRate] = { base: 0, vat: 0 };
    }
    acc[item.vatRate].base += itemSubtotal;
    acc[item.vatRate].vat += itemVat;
    return acc;
  }, {} as { [key: number]: { base: number, vat: number } });


  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 print:hidden">
        <h2 className="text-2xl font-bold tracking-tight text-center sm:text-left">{t('invoice')} #{invoice.invoiceNumber}</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
                <Link href="/invoices">Back to Invoices</Link>
            </Button>
          <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />{t('print_invoice')}</Button>
        </div>
      </div>
      <Card className="max-w-4xl mx-auto print:shadow-none print:border-none" id="invoice-to-print">
        <CardHeader className="p-4 sm:p-8">
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-4">
                <div>
                     {settings.logoUrl ? (
                        <Image src={settings.logoUrl} alt="Company Logo" width={120} height={120} className="object-contain" />
                    ) : (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-3 bg-primary rounded-lg text-primary-foreground">
                                <Building2 size={24}/>
                            </div>
                            <h1 className="text-2xl font-bold">{settings.companyName}</h1>
                        </div>
                    )}
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                    <h1 className="text-3xl font-bold text-primary">{t('invoice')}</h1>
                    <p className="text-muted-foreground">#{invoice.invoiceNumber}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div>
                    <h3 className="font-semibold mb-2">{settings.companyName}</h3>
                    <p className="text-sm text-muted-foreground">
                        {settings.address}<br />
                        {settings.postalCode} {settings.city}<br />
                        Kt: {settings.kennitala}<br />
                        {settings.vatNumber && `${t('vat_number')}: ${settings.vatNumber}`}
                    </p>
                </div>
                <div className="text-left sm:text-right">
                     <h3 className="font-semibold mb-2">{t('bill_to')}</h3>
                     <p className="text-sm text-muted-foreground">
                        {invoice.clientName}<br />
                        {invoice.clientAddress}<br/>
                        Kt: {invoice.clientKennitala}
                    </p>
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="text-sm">
                    <span className="font-semibold">{t('issue_date')}: </span>
                    <span className="text-muted-foreground">{formatDate(invoice.issueDate)}</span>
                </div>
                 <div className="text-sm sm:text-right">
                    <span className="font-semibold">{t('due_date')}: </span>
                    <span className="text-muted-foreground">{formatDate(invoice.dueDate)}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('item')}</TableHead>
                  <TableHead className="text-center">{t('quantity')}</TableHead>
                  <TableHead className="text-right">{t('unit_price')}</TableHead>
                  <TableHead className="text-right">{t('vat')}</TableHead>
                  <TableHead className="text-right">{t('total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{item.vatRate}%</TableCell>
                    <TableCell className="text-right whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooterComponent>
                  <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">{t('subtotal')}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(subtotal)}</TableCell>
                  </TableRow>
                  {Object.entries(vatBreakdown).map(([rate, amounts]) => (
                       <TableRow key={rate}>
                          <TableCell colSpan={3} className="text-right font-medium">{t('base_for_vat')} ({rate}%)</TableCell>
                           <TableCell className="text-right whitespace-nowrap">{formatCurrency(amounts.base)}</TableCell>
                          <TableCell className="text-right whitespace-nowrap">{formatCurrency(amounts.vat)}</TableCell>
                      </TableRow>
                  ))}
                   <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">{t('total')} {t('vat')}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(vatAmount)}</TableCell>
                  </TableRow>
                  <TableRow className="text-lg font-bold bg-muted">
                      <TableCell colSpan={4} className="text-right">{t('grand_total')}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">{formatCurrency(grandTotal)}</TableCell>
                  </TableRow>
              </TableFooterComponent>
            </Table>
          </div>
        </CardContent>
        <Separator className="my-0" />
        <CardFooter className="p-4 sm:p-8 flex-col items-start gap-4">
            <div>
                <h3 className="font-semibold mb-2">{t('payment_details')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('bank_account')}: {settings.bank}-{settings.branch}-{settings.accountNumber}
                </p>
                 <p className="text-sm text-muted-foreground">
                    Kennitala: {settings.kennitala}
                </p>
            </div>
           <p className="text-xs text-muted-foreground text-center w-full mt-8">
              {t('legal_footer')}
            </p>
        </CardFooter>
      </Card>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-to-print, #invoice-to-print * {
            visibility: visible;
          }
          #invoice-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
