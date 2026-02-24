'use strict';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useUserList } from '@/hooks/useUserList';

import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useUserList');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

// it('should return a specific list', async () => {
//   mockAxios.get.mockResolvedValue({ data: 'success' });
//   function setCurrentListInfo(){};
//   const { result, waitForNextUpdate } = renderHook(() => useUserList(12, setCurrentListInfo), {
//     wrapper,
//   });

//   await waitForNextUpdate(result.current.isSuccess);
//   expect(result.current.data).toEqual('success');
//   expect(mockAxios.get).toHaveBeenCalledTimes(1);
// });

it('should return null if there is no id', async () => {
  mockAxios.get.mockResolvedValue({ data: 'success' });

  const { result, waitForNextUpdate } = renderHook(() => useUserList(), {
    wrapper,
  });

  await waitForNextUpdate(result.current.isSuccess);
  expect(result.current.data).toBeUndefined();
  expect(mockAxios.get).toHaveBeenCalledTimes(0);

  // expect(result.current.isSuccess).toBe(true);
  // expect(result.current.data).toEqual('success');
  // expect(mockAxios.get).toHaveBeenCalledTimes(1);
});
