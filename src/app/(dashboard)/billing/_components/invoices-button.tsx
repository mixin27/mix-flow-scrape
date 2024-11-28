'use client';

import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { DownloadInvoice } from '@/actions/billing/download-invoice';
import { Button } from '@/components/ui/button';

export default function InvoicesButton({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: DownloadInvoice,
    onSuccess: (invoiceUrl) => (window.location.href = invoiceUrl as string),
    onError: () => {
      toast.error('Something went wrong');
    },
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 px-1 text-xs text-muted-foreground"
      disabled={mutation.isPending}
      onClick={() => {
        mutation.mutate(id);
      }}
    >
      Invoices
      {mutation.isPending && <Loader2Icon className="size-4 animate-spin" />}
    </Button>
  );
}
