'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

export async function RemoveWorkflowSchedule(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  await prisma.workflow.update({
    where: { id, userId },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });
}
