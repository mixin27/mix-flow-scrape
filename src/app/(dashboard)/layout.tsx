import React from 'react';

import { SignedIn, UserButton } from '@clerk/nextjs';

import BreadcrumbHeader from '@/components/common/breadcrumb-header';
import DesktopSidebar from '@/components/common/sidebar';
import { ModeToggle } from '@/components/common/theme/theme-mode-toggle';
import { Separator } from '@/components/ui/separator';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DesktopSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="container flex h-[50px] items-center justify-between px-6 py-4">
          <BreadcrumbHeader />

          <div className="flex items-center gap-1">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="container flex-1 py-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
