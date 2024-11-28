'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { CoinsIcon, CreditCard } from 'lucide-react';

import { PurchaseCredits } from '@/actions/billing/purchase-credits';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditsPacks, PackId } from '@/types/billing';

export default function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState<PackId>(PackId.MEDIUM);

  const mutation = useMutation({
    mutationFn: PurchaseCredits,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <CoinsIcon className="size-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => setSelectedPack(value as PackId)}
          value={selectedPack}
        >
          {CreditsPacks.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center space-x-3 rounded-lg bg-secondary/50 p-3 hover:bg-secondary"
              onClick={() => setSelectedPack(pack.id)}
            >
              <RadioGroupItem value={pack.id} id={pack.id} />
              <Label className="flex w-full cursor-pointer justify-between">
                <span className="font-medium">
                  {pack.name} - {pack.label}
                </span>
                <span className="font-bold text-primary">
                  ${(pack.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={mutation.isPending}
          onClick={() => {
            mutation.mutate(selectedPack);
          }}
        >
          <CreditCard className="mr-2 size-5" />
          Purchase credits
        </Button>
      </CardFooter>
    </Card>
  );
}
