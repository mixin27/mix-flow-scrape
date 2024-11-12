'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PublishWorkflow } from '@/actions/workflows/publish-workflow';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/use-execution-plan';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function PublishBtn() {
  const router = useRouter();
  const workflowId = useWorkflowId();

  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: () => {
      toast.success('Workflow published', { id: workflowId });
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
        const plan = generate();
        if (!plan) {
          // Client side validation!
          return;
        }
        toast.loading('Publishing workflow...', { id: workflowId });
        mutation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
}
