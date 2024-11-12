'use client';

import { useRouter } from 'next/navigation';

import { ChevronLeftIcon } from 'lucide-react';

import TooltipWrapper from '@/components/common/tooltip-wrapper';
import { Button } from '@/components/ui/button';

import ExecuteBtn from './execute-btn';
import NavigationTabs from './navigation-tabs';
import PublishBtn from './publish-btn';
import SaveBtn from './save-btn';
import UnpublishBtn from './unpublish-btn';

type TopbarProps = {
  title: string;
  subtitle?: string;
  hideButtons?: boolean;
  isPublished?: boolean;
};

function Topbar({
  title,
  subtitle,
  hideButtons = false,
  isPublished = false,
}: TopbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 flex h-[60px] w-full border-separate justify-between border-b-2 bg-background p-2">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              router.back();
            }}
          >
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
          <p className="truncate text-ellipsis font-bold">{title}</p>
          {subtitle && (
            <p className="truncate text-ellipsis text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <NavigationTabs />
      <div className="flex flex-1 justify-end gap-1">
        {!hideButtons && (
          <>
            <ExecuteBtn />
            {isPublished && <UnpublishBtn />}

            {!isPublished && (
              <>
                <SaveBtn />
                <PublishBtn />
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
