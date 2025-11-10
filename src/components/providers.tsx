'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import type { AppRouter } from '@/server/trpc/router';
import { TRPCProvider, getBaseUrl } from '@/trpc/client';
import { queryClient } from '@/trpc/shared';

export function Providers({ children }: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            return {
              'content-type': 'application/json',
            };
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

