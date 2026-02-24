'use strict';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useCreateSaveSearch } from '@/hooks/useCreateSaveSearch';
import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useCreateSaveSearch');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should make an api call', async () => {
  // mock the axios post
  mockAxios.post.mockResolvedValue({ data: 'success' });

  const { result, waitForNextUpdate } = renderHook(
    () => useCreateSaveSearch(),
    { wrapper }
  );

  // wait for the api call to finish
  await waitForNextUpdate(
    result.current.mutate({ path: 'test', name: 'name' })
  );

  // check if the api call was made
  expect(mockAxios.post).toHaveBeenCalledTimes(1);
});
