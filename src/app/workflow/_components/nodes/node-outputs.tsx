'use client';

import React from 'react';

import { Handle, Position } from '@xyflow/react';

import { cn } from '@/lib/utils';
import { TaskParam } from '@/types/task';

import { ColorHandle } from './common';

export function NodeOutputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1 divide-y">{children}</div>;
}

export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="relative flex justify-end bg-secondary p-3">
      <p className="text-xs text-muted-foreground">{output.name}</p>

      <Handle
        id={output.name}
        type="source"
        position={Position.Right}
        className={cn(
          '!-right-2 !size-4 !border-2 !border-background !bg-muted-foreground',
          ColorHandle[output.type]
        )}
      />
    </div>
  );
}
