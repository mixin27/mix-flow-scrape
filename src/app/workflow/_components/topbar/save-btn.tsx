'use client';

import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon } from 'lucide-react';
import { toast } from 'sonner';

import { UpdateWorkflow } from '@/actions/workflows/update-workflow';
import { Button } from '@/components/ui/button';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function SaveBtn() {
  const workflowId = useWorkflowId();
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success('Flow saved successfully', { id: 'save-workflow' });
    },
    onError: () => {
      toast.error('Failed to save workflow', { id: 'save-workflow' });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading('Saving workflow...', { id: 'save-workflow' });

        saveMutation.mutate({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}
