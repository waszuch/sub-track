'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import type { SubscriptionInput } from '@/types/subscription';

export const useSubscriptions = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const { data: subscriptions = [], isLoading } = useQuery(
    trpc.subscriptions.getAll.queryOptions()
  );
  
  const createMutation = useMutation({
    ...trpc.subscriptions.create.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.subscriptions.getAll.queryKey() });
    },
  });

  const updateMutation = useMutation({
    ...trpc.subscriptions.update.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.subscriptions.getAll.queryKey() });
    },
  });

  const deleteMutation = useMutation({
    ...trpc.subscriptions.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.subscriptions.getAll.queryKey() });
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

