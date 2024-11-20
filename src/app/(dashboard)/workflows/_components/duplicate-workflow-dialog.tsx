'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Workflow } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { CopyIcon, Layers2Icon, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DuplicateWorkflow } from '@/actions/workflows/duplicate-workflow';
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
import { cn } from '@/lib/utils';
import {
  duplicateWorkflowSchema,
  duplicateWorkflowSchemaType,
} from '@/schema/workflow';

const DuplicateWorkflowDialog = ({ workflow }: { workflow: Workflow }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<duplicateWorkflowSchemaType>({
    resolver: zodResolver(duplicateWorkflowSchema),
    defaultValues: {
      name: `${workflow.name} copy`,
      description: workflow.description || '',
      workflowId: workflow.id,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkflow,
    onSuccess: (result) => {
      toast.success('Workflow duplicated', { id: 'duplicate-workflow' });
      setOpen((prev) => !prev);
      router.refresh();
    },
    onError: (error) => {
      toast.error('Failed to duplicate workflow', { id: 'duplicate-workflow' });
    },
  });

  const onSubmit = useCallback(
    (values: duplicateWorkflowSchemaType) => {
      toast.loading('Creating workflow...', { id: 'duplicate-workflow' });
      mutate(values);
    },
    [mutate]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(op) => {
        form.reset();
        setOpen(op);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'ml-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100'
          )}
        >
          <CopyIcon className="size-4 cursor-pointer text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader icon={Layers2Icon} title="Duplicate workflow" />

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
                      Choose a descriptive and unique name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Description
                      <p className="text-sm text-muted-foreground">
                        (optional)
                      </p>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isPending}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what your workflow does.
                      <br /> This is optional but it can help you remember the
                      workflow&apos;s purpose.
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

export default DuplicateWorkflowDialog;
