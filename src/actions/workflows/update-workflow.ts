'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { WorkflowStatus } from '@/types/workflow';

export async function UpdateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('unthenticated');
  }

  const workflow = await prisma.workflow.findUnique({
    where: { id, userId },
  });
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('workflow is not a draft');
  }

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      definition,
    },
  });
}
