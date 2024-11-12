'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';

export async function UnpublishWorkflow(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId },
  });
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error('Workflow is not in a published mode');
  }

  const updatedWorkflow = await prisma.workflow.update({
    where: { id, userId },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  return updatedWorkflow;
}
