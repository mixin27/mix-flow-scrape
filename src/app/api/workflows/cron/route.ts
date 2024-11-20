import { getAppUrl } from '@/lib/helpers/app-url';
import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';

export async function GET(req: Request) {
  const now = new Date();

  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  console.log('@@WORKFLOWS TO RUN', workflows.length);

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflowToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`
  );
  console.log('@@TRIGGER URL', triggerApiUrl);

  fetch(triggerApiUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET}`,
    },
    cache: 'no-store',
  }).catch((error) =>
    console.error(
      'Error triggering workflow with id',
      workflowId,
      ':error->',
      error.message
    )
  );
}
