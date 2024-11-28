import 'server-only';
import Stripe from 'stripe';

import { PackId, getCreditsPack } from '@/types/billing';

import prisma from '../prisma';

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  // event output sample
  //   writeFile('session_completed.json', JSON.stringify(event), (err) => {});

  if (!event.metadata) {
    throw new Error('missing metadata');
  }

  const { userId, packId } = event.metadata;
  if (!userId) {
    throw new Error('missing userId');
  }

  if (!packId) {
    throw new Error('missing packId');
  }

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error('purchased pack not found');
  }

  await prisma.userBalance.upsert({
    where: { userId },
    create: {
      userId,
      credits: purchasedPack.credits,
    },
    update: {
      credits: {
        increment: purchasedPack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
}
