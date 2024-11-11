'use client';

import Link from 'next/link';

import { Tabs, TabsList } from '@/components/ui/tabs';
import { useWorkflowId } from '@/hooks/use-workflow-id';

export default function NavigationTabs() {
  const workflowId = useWorkflowId();

  return (
    <Tabs className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
        <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
      </TabsList>
    </Tabs>
  );
}
