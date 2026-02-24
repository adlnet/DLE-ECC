'use strict';

import { renderHook } from '@testing-library/react-hooks';
import mockAxios from 'jest-mock-axios';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { useSubscribeToList } from '@/hooks/useSubscribeToList';

jest.unmock('@/hooks/useSubscribeToList');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should make an api call', async () => {
  // mock the axios patch
  mockAxios.patch.mockResolvedValue({ data: 'success' });

  const { result, waitForNextUpdate } = renderHook(() => useSubscribeToList(), {
    wrapper,
  });

  // wait for the api call to finish
  await waitForNextUpdate(result.current.mutate({ id: '1' }));

  // check if the api call was made
  expect(mockAxios.patch).toHaveBeenCalledTimes(1);
});
