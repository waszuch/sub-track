import { router } from './trpc';
import { subscriptionsRouter } from './routers/subscriptions';

export const appRouter = router({
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;

