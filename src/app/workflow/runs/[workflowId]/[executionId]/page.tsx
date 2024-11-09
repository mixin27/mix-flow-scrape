import { Suspense } from 'react';

import { Loader2Icon } from 'lucide-react';

import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/get-workflow-execution-with-phases';
import Topbar from '@/app/workflow/_components/topbar/topbar';

import ExecutionViewer from './_components/execution-viewer';

export default async function ExecutionViewerPage(props: {
  params: Promise<{ workflowId: string; executionId: string }>;
}) {
  const params = await props.params;
  const { workflowId, executionId } = params;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <Topbar
        title="Workflow run details"
        subtitle={`Run ID: ${executionId}`}
        hideButtons
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="size-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
  if (!workflowExecution) {
    return <div>Not found</div>;
  }

  return <ExecutionViewer execution={workflowExecution} />;
}
