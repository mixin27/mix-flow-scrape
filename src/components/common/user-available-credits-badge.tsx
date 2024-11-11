'use client';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { CoinsIcon, Loader2Icon } from 'lucide-react';

import { getAvailableCredits } from '@/actions/billing/get-available-credits';
import { cn } from '@/lib/utils';

import { buttonVariants } from '../ui/button';
import ReactCountupWrapper from './react-countup-wrapper';

export default function UserAvailableCreditsBadge() {
  const query = useQuery({
    queryKey: ['user-available-credits'],
    queryFn: getAvailableCredits,
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return (
    <Link
      href={`/billing`}
      className={cn(
        'w-full items-center space-x-2',
        buttonVariants({ variant: 'outline' })
      )}
    >
      <CoinsIcon size={20} className="text-primary" />
      <span className="font-semibold capitalize">
        {query.isLoading && <Loader2Icon className="size-4 animate-spin" />}

        {!query.isLoading && query.data && (
          <ReactCountupWrapper value={query.data} />
        )}
        {!query.isLoading && query.data === undefined && '-'}
      </span>
    </Link>
  );
}
