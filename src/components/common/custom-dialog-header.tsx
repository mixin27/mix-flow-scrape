'use client';

import { LucideIcon } from 'lucide-react';

import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type CustomDialogHeaderProps = {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

function CustomDialogHeader({
  icon: Icon,
  title,
  subtitle,
  iconClassName,
  titleClassName,
  subtitleClassName,
}: CustomDialogHeaderProps) {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="mb-2 flex flex-col items-center gap-2">
          {Icon && (
            <Icon className={cn('stroke-primary', iconClassName)} size={30} />
          )}
          {title && (
            <p className={cn('text-xl text-primary', titleClassName)}>
              {title}
            </p>
          )}

          {subtitle && (
            <p
              className={cn('text-sm text-muted-foreground', subtitleClassName)}
            >
              {subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
}

export default CustomDialogHeader;
