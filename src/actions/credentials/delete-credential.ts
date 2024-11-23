'use server';

import { auth } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

export async function DeleteCredential(name: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('unauthenticated');
  }

  await prisma.credential.delete({
    where: { userId_name: { userId, name } },
  });
}
