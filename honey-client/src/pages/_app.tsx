import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import Core from '~/components/base/Core';
import GlobalStyles from '~/components/common/GlobalStyles';

interface Props {
  isAuth: boolean;
  dehydratedState: DehydratedState;
}

export default function App({ Component, pageProps }: AppProps<Props>) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Core isAuth={pageProps.isAuth} />
        <ReactQueryDevtools />
        <GlobalStyles />
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
