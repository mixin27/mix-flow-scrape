import { useCallback } from 'react';

import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';

import {
  FlowToExecutionPlan,
  FlowToExecutionPlanError,
  FlowToExecutionPlanValidationError,
} from '@/lib/workflow/execution-plan';
import { AppNode } from '@/types/app-node';

import useFlowValidation from './use-flow-validation';

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: FlowToExecutionPlanError) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error('No entry point found');
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error('No all inputs values are set');
          setInvalidInputs(error.invalidElements ?? []);
          break;
        default:
          toast.error('Something went wrong');
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();

    return executionPlan;
  }, [clearErrors, handleError, toObject]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
