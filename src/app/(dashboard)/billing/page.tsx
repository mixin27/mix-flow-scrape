import { Suspense } from 'react';

import { ArrowLeftRightIcon, CoinsIcon } from 'lucide-react';

import { GetCreditsUsageInPeriod } from '@/actions/analytics/get-credits-usage-in-period';
import { getAvailableCredits } from '@/actions/billing/get-available-credits';
import { GetUserPurchaseHistory } from '@/actions/billing/get-user-purchase-history';
import ReactCountupWrapper from '@/components/common/react-countup-wrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Period } from '@/types/analytic';

import CreditsPurchase from './_components/credits-purchase';
import CreditsUsageChart from './_components/credits-usage-chart';
import InvoicesButton from './_components/invoices-button';

export default function BillingPage() {
  return (
    <div className="mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>

      <CreditsPurchase />

      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditUsageCard />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
}

async function BalanceCard() {
  const userBalance = await getAvailableCredits();
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Avaliable Credits
            </h3>
            <p className="text-4xl font-bold text-primary">
              <ReactCountupWrapper value={userBalance} />
            </p>
          </div>

          <CoinsIcon
            className="absolute bottom-0 right-0 text-primary opacity-20"
            size={140}
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  );
}

async function CreditUsageCard() {
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const data = await GetCreditsUsageInPeriod(period);

  return (
    <CreditsUsageChart
      data={data}
      title="Credits consumed"
      description="Daily credit consumed in the current month"
    />
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

async function TransactionHistoryCard() {
  const purchases = await GetUserPurchaseHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="size-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}

        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoicesButton id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
