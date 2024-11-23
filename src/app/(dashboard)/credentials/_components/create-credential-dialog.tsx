'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader, ShieldEllipsis } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CreateCredential } from '@/actions/credentials/create-credential';
import CustomDialogHeader from '@/components/common/custom-dialog-header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from '@/schema/credential';

type CreateCredentialDialogProps = {
  triggerText?: string;
};

const CreateCredentialDialog = ({
  triggerText,
}: CreateCredentialDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<createCredentialSchemaType>({
    resolver: zodResolver(createCredentialSchema),
    defaultValues: { name: '', value: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCredential,
    onSuccess: () => {
      toast.success('Credential created', { id: 'create-credential' });
      form.reset();
      setOpen(false);
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to create credential', { id: 'create-credential' });
    },
  });

  const onSubmit = useCallback(
    (values: createCredentialSchemaType) => {
      toast.loading('Creating credential...', { id: 'create-credential' });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText ?? 'Create'}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={ShieldEllipsis} title="Create credential" />

        <div className="p-6">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Name
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique and descriptive name for the credential
                      <br />
                      This name will be user to identify the credential
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Value
                      <p className="text-sm text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the value associated with this credential
                      <br /> This value will be securely encrypted and stored
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && 'Proceed'}
                {isPending && <Loader className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCredentialDialog;
