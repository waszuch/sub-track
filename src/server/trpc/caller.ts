import { appRouter } from './router';
import { createContext } from './context';

export async function createCaller(headers: Headers) {
  const ctx = await createContext({ headers });
  return appRouter.createCaller(ctx);
}

