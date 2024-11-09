'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';
import { ExecuteWorkflow } from '@/lib/workflow/execute-workflow';
import { FlowToExecutionPlan } from '@/lib/workflow/execution-plan';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from '@/types/workflow';

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error('workflowId is required.');
  }

  const workflow = await prisma.workflow.findUnique({
    where: { userId, id: workflowId },
  });
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  //   let executionPlan: WorkflowExecutionPlan;
  if (!flowDefinition) {
    throw new Error('flow definition is not defined');
  }

  const flow = JSON.parse(flowDefinition);
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if (result.error) {
    throw new Error('flow definition is not valid');
  }

  if (!result.executionPlan) {
    throw new Error('no execution plan generated');
  }

  const executionPlan = result.executionPlan;
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error('workflow execution not created');
  }

  // run this on background
  ExecuteWorkflow(execution.id);

  return execution;
}
