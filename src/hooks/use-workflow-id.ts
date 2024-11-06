import { useParams } from 'next/navigation';

export const useWorkflowId = () => {
  const params = useParams();
  return params.workflowId as string;
};
