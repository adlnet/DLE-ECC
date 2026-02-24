'use strict';

// tests for hooks/useSubscribedLists.js
import { renderHook } from '@testing-library/react-hooks';
import mockAxios from 'jest-mock-axios';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { useSubscribedLists } from '@/hooks/useSubscribedLists';

jest.unmock('@/hooks/useSubscribedLists');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should return the mocked data', async () => {
  mockAxios.get.mockResolvedValue({ data: [{test: test}] });
  const { result, waitForNextUpdate } = renderHook(() => useSubscribedLists(), {
    wrapper,
  });
  await waitForNextUpdate(result.current.isSuccess);

  expect(result.current.isSuccess).toBe(true);
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
});
