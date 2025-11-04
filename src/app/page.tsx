'use client';

import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog';
import { CostSummary } from '@/components/CostSummary';
import { CostByCategory } from '@/components/CostByCategory';
import { Header } from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { subscriptions, addSubscription, removeSubscription } =
    useSubscriptionStore();

  return (
    <div className="min-h-screen bg-background">
      <Header subscriptions={subscriptions} />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-end mb-8">
          <AddSubscriptionDialog onAdd={addSubscription} />
        </div>

        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="text-xl text-muted-foreground mb-4">
              No subscriptions yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Add Subscription" to get started
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <CostSummary subscriptions={subscriptions} />
              <CostByCategory subscriptions={subscriptions} />
            </motion.div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
