import { useParams } from 'next/navigation';

export const useExecutionId = () => {
  const params = useParams();
  return params.executionId as string;
};
