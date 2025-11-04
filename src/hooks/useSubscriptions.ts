import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { Subscription } from '@/types/subscription';

export const useSubscriptions = () => {
  const queryClient = useQueryClient();
  const { subscriptions, addSubscription, updateSubscription, removeSubscription } =
    useSubscriptionStore();

  const subscriptionsQuery = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => Promise.resolve(subscriptions),
    initialData: subscriptions,
  });

  const addMutation = useMutation({
    mutationFn: async (subscription: Omit<Subscription, 'id' | 'createdAt'>) => {
      addSubscription(subscription);
      return subscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Subscription>;
    }) => {
      updateSubscription(id, data);
      return { id, data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      removeSubscription(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });

  return {
    subscriptions,
    isLoading: subscriptionsQuery.isLoading,
    addSubscription: addMutation.mutate,
    updateSubscription: updateMutation.mutate,
    removeSubscription: removeMutation.mutate,
  };
};

