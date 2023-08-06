import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Core from '~/components/base/Core';
import GlobalStyles from '~/components/common/GlobalStyles';
import ModalContainer from '~/components/common/ModalContainer';

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
            refetchOnWindowFocus: false,
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
        <Toaster position="top-right" />
        <ModalContainer />
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}
