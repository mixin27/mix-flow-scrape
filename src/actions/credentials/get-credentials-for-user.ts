'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

export async function GetCredentialsForUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('unauthenticated');

  return prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: 'asc',
    },
  });
}
