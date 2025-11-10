'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog';
import { CostSummary } from '@/components/CostSummary';
import { CostByCategory } from '@/components/CostByCategory';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { subscriptions, addSubscription, removeSubscription, isLoading } =
    useSubscriptions();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending || isLoading || !session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header subscriptions={subscriptions} />
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-6xl">
        <div className="flex justify-center md:justify-end mb-6 md:mb-8">
          <AddSubscriptionDialog onAdd={addSubscription} />
        </div>

        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 md:py-20 text-center"
          >
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              No subscriptions yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click &quot;Add Subscription&quot; to get started
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <CostSummary subscriptions={subscriptions} />
              <CostByCategory subscriptions={subscriptions} />
            </motion.div>

            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Your Subscriptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <AnimatePresence mode="popLayout">
                  {subscriptions.map((subscription) => (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SubscriptionCard
                        subscription={subscription}
                        onDelete={removeSubscription}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
