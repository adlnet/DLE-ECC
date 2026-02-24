'use strict';

// tests for useInterestLists hook

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useInterestLists } from '@/hooks/useInterestLists';
import mockAxios from 'jest-mock-axios';
import userListsData from '@/__mocks__/data/userLists.data';

jest.unmock('@/hooks/useInterestLists');
const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should make an api call', async () => {
  mockAxios.get.mockResolvedValue({ data: userListsData });
  const { result, waitForNextUpdate } = renderHook(() => useInterestLists(), {
    wrapper,
  });
  await waitForNextUpdate(result.current.isSuccess);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
});
