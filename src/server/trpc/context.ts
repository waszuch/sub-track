import { auth } from '@/lib/auth';

export async function createContext(opts: { headers: Headers }) {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  try {
    session = await auth.api.getSession({
      headers: opts.headers,
    });
  } catch (error) {
    console.error('Failed to get session:', error);
  }

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

