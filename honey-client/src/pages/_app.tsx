import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import Core from '~/components/base/Core';
import GlobalStyles from '~/components/common/GlobalStyles';
import { useRequiredLoginPageEffect } from '~/hooks/useRequiredLoginPageEffect';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      })
  );

  useRequiredLoginPageEffect();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ReactQueryDevtools />
        <GlobalStyles />
        <Core />
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
