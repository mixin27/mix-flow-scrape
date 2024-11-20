'use server';

import { auth } from '@clerk/nextjs/server';
import parser from 'cron-parser';

import prisma from '@/lib/prisma';

export async function UpdateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  try {
    const interval = parser.parseExpression(cron, { utc: true });

    return await prisma.workflow.update({
      where: { id, userId },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('invalid cron: ', error.message);
    throw new Error('invalid cron expression');
  }
}
