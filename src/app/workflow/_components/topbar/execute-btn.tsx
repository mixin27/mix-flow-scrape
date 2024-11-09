'use client';

import { PlayIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import useExecutionPlan from '@/hooks/use-execution-plan';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function ExecuteBtn() {
  const workflowId = useWorkflowId();

  const generate = useExecutionPlan();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log('---- plan ----');
        console.table(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}
