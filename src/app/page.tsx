'use client';

import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { AddSubscriptionDialog } from '@/components/AddSubscriptionDialog';
import { CostSummary } from '@/components/CostSummary';
import { CostByCategory } from '@/components/CostByCategory';

export default function Home() {
  const { subscriptions, addSubscription, removeSubscription } =
    useSubscriptionStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">SubTrack</h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscriptions in one place
            </p>
          </div>
          <AddSubscriptionDialog onAdd={addSubscription} />
        </div>

        {subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl text-muted-foreground mb-4">
              No subscriptions yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Add Subscription" to get started
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CostSummary subscriptions={subscriptions} />
              <CostByCategory subscriptions={subscriptions} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onDelete={removeSubscription}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
