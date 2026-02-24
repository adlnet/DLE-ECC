'use strict';

import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import mockAxios from 'jest-mock-axios';

import { useUpdateUserList } from '@/hooks/useUpdateUserList';

jest.unmock('@/hooks/useUpdateUserList');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

it('should make a patch call and return new data', async () => {
  // mockAxios
  mockAxios.patch.mockReturnValue({ data: { message: 'tada' } });
  const { result, waitForNextUpdate } = renderHook(
    () => useUpdateUserList('token'),
    { wrapper }
  );

  result.current.mutate({ listData: 'tada', id: 'tada' });
  await waitForNextUpdate(result.current.isSuccess);

  expect(mockAxios.patch).toHaveBeenCalled();
});
