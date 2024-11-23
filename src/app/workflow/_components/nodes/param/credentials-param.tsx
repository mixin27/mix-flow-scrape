import { useId } from 'react';

import { useQuery } from '@tanstack/react-query';

import { GetCredentialsForUser } from '@/actions/credentials/get-credentials-for-user';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ParamProps } from '@/types/app-node';

export default function CredentialsParam({
  param,
  updateNodeParamValue,
  value,
}: ParamProps) {
  const id = useId();

  const query = useQuery({
    queryKey: ['credentials-for-user'],
    queryFn: () => GetCredentialsForUser(),
    refetchInterval: 10000, // 10s
  });

  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor={id} className="flex text-sm">
        {param.name}
        {param.required && <p className="px-2 text-red-400">*</p>}
      </Label>
      <Select
        onValueChange={(value) => updateNodeParamValue(value)}
        defaultValue={value}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
