import { MutationCache, QueryClient, type Query } from '@tanstack/react-query';

export function makeQueryClient() {
  let client: QueryClient;
  
  return (client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        client.invalidateQueries({
          predicate: (query: Query) => {
            const mutationKey = mutation.options.mutationKey?.[0] as string;
            const queryKey = query.queryKey[0] as string;
            
            if (!mutationKey || !queryKey) return false;
            
            const [mutationResource] = mutationKey.split('.');
            const [queryResource] = queryKey.split('.');
            
            return mutationResource === queryResource;
          },
        });
      },
    }),
  }));
}

let clientQueryClientSingleton: QueryClient | undefined = undefined;
export const queryClient = (() => {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
})();

