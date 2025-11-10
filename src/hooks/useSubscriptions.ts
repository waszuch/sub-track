'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { SubscriptionInput } from '@/types/subscription';

export const useSubscriptions = () => {
  const trpc = useTRPC();
  
  const { data: subscriptions = [], isLoading } = useQuery(
    trpc.subscriptions.getAll.queryOptions()
  );
  
  const createMutation = useMutation(trpc.subscriptions.create.mutationOptions());
  const updateMutation = useMutation(trpc.subscriptions.update.mutationOptions());
  const deleteMutation = useMutation(trpc.subscriptions.delete.mutationOptions());

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

