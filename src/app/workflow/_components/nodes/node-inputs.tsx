import React from 'react';

import { Handle, Position } from '@xyflow/react';

import { cn } from '@/lib/utils';
import { TaskParam } from '@/types/task';

import NodeParamField from './node-param-field';

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  return (
    <div className="relative flex w-full justify-start bg-secondary p-3">
      <NodeParamField param={input} nodeId={nodeId} />

      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            '!-left-2 !size-4 !border-2 !border-background !bg-muted-foreground'
          )}
        />
      )}
    </div>
  );
}
