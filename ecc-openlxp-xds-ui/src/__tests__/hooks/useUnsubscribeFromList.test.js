'use strict';

// tests for useUnsubscribeFromList hook

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useUnsubscribeFromList } from '@/hooks/useUnsubscribeFromList';
import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useUnsubscribeFromList');
const wrapper = ({ children }) => (
  <QueryClientWrapper>
    <div>{children}</div>
  </QueryClientWrapper>
);

it('should make an api call', async () => {
  // mock axios.patch call
  mockAxios.patch.mockResolvedValue({ data: 'succeeded' });

  const { result, waitForNextUpdate } = renderHook(
    () => useUnsubscribeFromList('test', 'test', 'test'),
    { wrapper }
  );

  // wait for the hook to update
  await waitForNextUpdate(result.current.mutate({ id: 1 }));

  // check if the api call was made
  expect(mockAxios.patch).toHaveBeenCalledTimes(1);
});
