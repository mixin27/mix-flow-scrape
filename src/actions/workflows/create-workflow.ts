'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import {
  createWorkflowSchema,
  createWorkflowSchemaType,
} from '@/schema/workflow';
import { WorkflowStatus } from '@/types/workflow';

export async function CreateWorkflow(form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error('invalid form data');
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error('unauthenticated');
  }

  const result = await prisma.workflow.create({
    data: { userId, status: WorkflowStatus.DRAFT, definition: 'TODO', ...data },
  });

  if (!result) {
    throw new Error('failed to create workflow');
  }

  return result;
}
