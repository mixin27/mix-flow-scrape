import { ParamProps } from '@/types/app-node';

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <div className="text-xs">{param.name}</div>;
}
