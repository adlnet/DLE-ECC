'use strict';

// tests for hooks/useDeleteSavedSearch

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { renderHook } from '@testing-library/react-hooks';
import { useDeleteSavedSearch } from '@/hooks/useDeleteSavedSearch';
import mockAxios from 'jest-mock-axios';

jest.unmock('@/hooks/useDeleteSavedSearch');

const wrapper = ({ children }) => (
  <QueryClientWrapper>{children}</QueryClientWrapper>
);

it('should make a axios.delete call', async () => {
  // mock axios.delete call
  mockAxios.delete.mockImplementation(() => Promise.resolve({}));
  const { result, waitForNextUpdate, waitFor } = renderHook(
    () => useDeleteSavedSearch(),
    { wrapper }
  );

  // wait for the hook to finish
  await waitForNextUpdate(result.current.mutate({ id: 1 }));

  // check if axios.delete was called
  expect(mockAxios.delete).toHaveBeenCalledTimes(1);
});
