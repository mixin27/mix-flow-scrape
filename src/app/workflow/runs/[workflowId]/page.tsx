import { Suspense } from 'react';

import { InboxIcon, Loader2Icon } from 'lucide-react';

import { GetWorkflowExecutions } from '@/actions/workflows/get-workflow-executions';

import Topbar from '../../_components/topbar/topbar';
import ExecutionsTable from './_components/executions-table';

export default async function ExecutionPage(props: {
  params: Promise<{ workflowId: string }>;
}) {
  const params = await props.params;
  const { workflowId } = params;

  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        title="All runs"
        subtitle="List of all your workflow runs"
        hideButtons
      />

      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2Icon className="animate-spin stroke-primary" size={30} />
          </div>
        }
      >
        <ExecutionsTableWrapper workflowId={workflowId} />
      </Suspense>
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <div className="flex size-20 items-center justify-center rounded-full bg-accent">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="font-bold">
              No runs have been triggered yet for this workflow
            </p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container w-full py-6">
      <ExecutionsTable initialData={executions} />
    </div>
  );
}
