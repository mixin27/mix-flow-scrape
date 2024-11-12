'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { FlowToExecutionPlan } from '@/lib/workflow/execution-plan';
import { CalculateWorkflowCost } from '@/lib/workflow/helpers';
import { WorkflowStatus } from '@/types/workflow';

export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId },
  });
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not a draft');
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error('flow definition is not valid');
  }

  if (!result.executionPlan) {
    throw new Error('no execution plan generated');
  }

  const creditsCost = CalculateWorkflowCost(flow.nodes);
  const updatedWorkflow = await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
      status: WorkflowStatus.PUBLISHED,
    },
  });

  return updatedWorkflow;
}
