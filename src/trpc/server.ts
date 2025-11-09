import 'server-only';

import { headers } from 'next/headers';
import { createCaller } from '@/server/trpc/caller';

export async function getServerClient() {
  return await createCaller(await headers());
}

