'use strict';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useCreateUserList } from '@/hooks/useCreateUserList';
import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useCreateUserList');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

// tests for useCreateUserList hook

it('should make an axios.post call', async () => {
  // mock axios.post
  mockAxios.post.mockResolvedValueOnce({
    data: {
      id: '1',
      name: 'test',
      description: 'test',
      users: [],
      createdAt: '2020-01-01',
      updatedAt: '2020-01-01',
    },
  });
  const { result, waitForNextUpdate } = renderHook(() => useCreateUserList(), {
    wrapper,
  });

  await waitForNextUpdate(
    result.current.mutate({
      name: 'test',
      description: 'test',
      experiences: [],
    })
  );

  expect(mockAxios.post).toHaveBeenCalledTimes(1);
});
