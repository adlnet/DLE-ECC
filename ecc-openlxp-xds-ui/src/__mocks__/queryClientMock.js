'use strict';

import { QueryClient, QueryClientProvider } from 'react-query';

export const QueryClientWrapper = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
