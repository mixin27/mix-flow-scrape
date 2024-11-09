'use client';

import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import { toast } from 'sonner';

import { RunWorkflow } from '@/actions/workflows/run-workflow';
import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/use-execution-plan';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function ExecuteBtn() {
  const router = useRouter();
  const workflowId = useWorkflowId();

  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();

  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (execution) => {
      toast.success('Execute started', { id: 'flow-execution' });
      // revalidatePath('/workflow/runs');
      router.push(`/workflow/runs/${workflowId}/${execution.id}`);
    },
    onError: (err) => {
      console.log(err);
      toast.error('Something went wrong', { id: 'flow-execution' });
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

        mutation.mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}
