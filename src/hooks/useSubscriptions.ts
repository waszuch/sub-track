'use client';

import { trpc } from '@/trpc/client';
import type { SubscriptionInput } from '@/types/subscription';

export const useSubscriptions = () => {
  const utils = trpc.useUtils();
  const { data: subscriptions = [], isLoading } = trpc.subscriptions.getAll.useQuery();
  
  const createMutation = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      utils.subscriptions.getAll.invalidate();
    },
  });

  const updateMutation = trpc.subscriptions.update.useMutation({
    onSuccess: () => {
      utils.subscriptions.getAll.invalidate();
    },
  });

  const deleteMutation = trpc.subscriptions.delete.useMutation({
    onSuccess: () => {
      utils.subscriptions.getAll.invalidate();
    },
  });

  return {
    subscriptions,
    isLoading,
    addSubscription: (data: SubscriptionInput) => createMutation.mutate(data),
    updateSubscription: (id: string, data: Partial<SubscriptionInput>) => 
      updateMutation.mutate({ id, data }),
    removeSubscription: (id: string) => deleteMutation.mutate({ id }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

