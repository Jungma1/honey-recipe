import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import Core from '~/components/base/Core';
import GlobalStyles from '~/components/common/GlobalStyles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <GlobalStyles />
      <Core />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
