'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import { toast } from 'sonner';

import { RunWorkflow } from '@/actions/workflows/run-workflow';
import { Button } from '@/components/ui/button';

export default function RunBtn({ workflowId }: { workflowId: string }) {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (execution) => {
      toast.success('Workflow started', { id: workflowId });
      router.push(`/workflow/runs/${workflowId}/${execution.id}`);
    },
    onError: () => {
      toast.error('Something went wrong', { id: workflowId });
    },
  });
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Scheduling run...', { id: workflowId });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
}
