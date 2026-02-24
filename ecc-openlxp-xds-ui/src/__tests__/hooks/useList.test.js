'use strict';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useList } from '@/hooks/useList';
import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useList');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should return the mocked data', async () => {
  mockAxios.get.mockResolvedValue({ data: 'success' });
  const { result, waitForNextUpdate } = renderHook(() => useList(12), {
    wrapper,
  });
  await waitForNextUpdate(result.current.isSuccess);

  expect(result.current.isSuccess).toBe(true);
  expect(result.current.data).toBe('success');
  expect(mockAxios.get).toHaveBeenCalledTimes(1);
});

it('should return null if there is no id provided', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useList(null), {
    wrapper,
  });

  await waitForNextUpdate(result.current.isSuccess);
  expect(mockAxios.get).toHaveBeenCalled();
});
