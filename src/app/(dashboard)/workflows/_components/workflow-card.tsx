'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Workflow } from '@prisma/client';
import { format, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import {
  ChevronRightIcon,
  ClockIcon,
  CoinsIcon,
  CornerDownRightIcon,
  FileTextIcon,
  MoreVerticalIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from 'lucide-react';

import ExecutionStatusIndicator, {
  ExecutionStatusLabel,
} from '@/app/workflow/runs/[workflowId]/_components/execution-status-indicator';
import TooltipWrapper from '@/components/common/tooltip-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { WorkflowExecutionStatus, WorkflowStatus } from '@/types/workflow';

import DeleteWorkflowDialog from './delete-workflow-dialog';
import DuplicateWorkflowDialog from './duplicate-workflow-dialog';
import RunBtn from './run-btn';
import SchedulerDialog from './scheduler-dialog';

type WorkflowCardProps = {
  workflow: Workflow;
};

const statusColors = {
  [WorkflowStatus.DRAFT]: 'bg-yellow-400 text-yellow-600',
  [WorkflowStatus.PUBLISHED]: 'bg-primary',
};

function WorkflowCard({ workflow }: WorkflowCardProps) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;

  return (
    <Card className="group/card border-separate overflow-hidden rounded-lg border shadow-sm hover:shadow-md dark:shadow-primary/30">
      <CardContent className="flex h-[100px] items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="size-5" />
            ) : (
              <PlayIcon className="size-5 text-white" />
            )}
          </div>

          <div>
            <h3 className="flex items-center text-base font-bold text-muted-foreground">
              <TooltipWrapper content={workflow.description}>
                <Link
                  href={`/workflow/editor/${workflow.id}`}
                  className="flex items-center hover:underline"
                >
                  {workflow.name}
                </Link>
              </TooltipWrapper>

              {isDraft && (
                <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                  Draft
                </span>
              )}

              <DuplicateWorkflowDialog workflow={workflow} />
            </h3>

            <ScheduleSection
              workflowId={workflow.id}
              isDraft={isDraft}
              creditsCost={workflow.creditsCost}
              cron={workflow.cron}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId={workflow.id} />}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: 'outline',
                size: 'sm',
              }),
              'flex items-center gap-2'
            )}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowActions
            workflowId={workflow.id}
            workflowName={workflow.name}
          />
        </div>
      </CardContent>
      <LastRunDetails workflow={workflow} />
    </Card>
  );
}

function WorkflowActions({
  workflowId,
  workflowName,
}: {
  workflowId: string;
  workflowName: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DeleteWorkflowDialog
        workflowId={workflowId}
        workflowName={workflowName}
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content="More actions">
              <div className="flex h-full w-full items-center justify-center">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 text-destructive"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ScheduleSection({
  workflowId,
  isDraft,
  creditsCost = 0,
  cron,
}: {
  workflowId: string;
  isDraft: boolean;
  creditsCost?: number;
  cron: string | null;
}) {
  if (isDraft) return null;

  return (
    <div className="flex items-center gap-2">
      <CornerDownRightIcon className="size-4 text-muted-foreground" />
      <SchedulerDialog
        workflowId={workflowId}
        cron={cron}
        key={`${cron}-${workflowId}`}
      />
      <MoveRightIcon className="size-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 rounded-sm text-muted-foreground"
          >
            <CoinsIcon className="size-4" />
            {creditsCost}
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

function LastRunDetails({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status == WorkflowStatus.DRAFT;
  if (isDraft) return null;

  const { lastRunAt, lastRunStatus, lastRunId, nextRunAt } = workflow;
  const formattedStartedAt =
    lastRunAt && formatDistanceToNow(lastRunAt, { addSuffix: true });

  const nextSchedule = nextRunAt && format(nextRunAt, 'yyyy-MM-dd HH:mm');
  const nextScheduleUTC =
    nextRunAt && formatInTimeZone(nextRunAt, 'UTC', 'HH:mm');

  return (
    <div className="flex items-center justify-between bg-primary/5 px-4 py-1 text-muted-foreground">
      <div className="flex items-center gap-2 text-sm">
        {lastRunAt && (
          <Link
            href={`/workflow/runs/${workflow.id}/${lastRunId}`}
            className="group flex items-center gap-2 text-sm"
          >
            <span>Last run:</span>
            <ExecutionStatusIndicator
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <ExecutionStatusLabel
              status={lastRunStatus as WorkflowExecutionStatus}
            />
            <span>{formattedStartedAt}</span>
            <ChevronRightIcon
              size={14}
              className="-translate-x-[2px] transition group-hover:translate-x-0"
            />
          </Link>
        )}

        {!lastRunAt && <p>No runs yet</p>}
      </div>

      {nextRunAt && (
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon size={12} />
          <span>Next run at:</span>
          <span>{nextSchedule}</span>
          <span className="text-xs">({nextScheduleUTC} UTC)</span>
        </div>
      )}
    </div>
  );
}

export default WorkflowCard;
