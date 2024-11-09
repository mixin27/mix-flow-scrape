'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  return prisma.workflowExecution.findUnique({
    where: { userId, id: executionId },
    include: {
      phases: {
        orderBy: { number: 'asc' },
      },
    },
  });
}
