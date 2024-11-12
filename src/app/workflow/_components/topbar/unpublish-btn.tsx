'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';

import { UnpublishWorkflow } from '@/actions/workflows/unpublish-workflow';
import { Button } from '@/components/ui/button';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function UnpublishBtn() {
  const router = useRouter();
  const workflowId = useWorkflowId();

  const mutation = useMutation({
    mutationFn: UnpublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow unpublished', { id: workflowId });
      router.refresh();
    },
    onError: (err) => {
      console.log(err);
      toast.error('Something went wrong', { id: workflowId });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Unpublishing workflow...', { id: workflowId });
        mutation.mutate(workflowId);
      }}
    >
      <DownloadIcon size={16} className="stroke-orange-500" />
      Unpublish
    </Button>
  );
}
