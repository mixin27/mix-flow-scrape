import { Loader2Icon } from 'lucide-react';

import Logo from '@/components/common/logo';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Logo iconSize={50} fontSize="text-3xl" />
      <Separator className="max-w-xs" />
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="animate-spin stroke-primary" size={16} />
        <p className="text-muted-foreground">Setting up your account</p>
      </div>
    </div>
  );
}
