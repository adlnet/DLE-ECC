'use strict';

import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import mockAxios from 'jest-mock-axios';

import {useUserOwnedLists} from '@/hooks/useUserOwnedLists';
import userOwnedListsData from '@/__mocks__/data/userLists.data';

jest.unmock('@/hooks/useUserOwnedLists');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useUserOwnedLists', () => {
  it('should return a list of courses found', async () => {
    mockAxios.get.mockResolvedValue({ data: userOwnedListsData });
    const { result, waitForNextUpdate } = renderHook(
      () => useUserOwnedLists('testToken'),
      { wrapper }
    );
    await waitForNextUpdate(result.current.isSuccess);
    expect(result.current.data).toEqual(userOwnedListsData);
  });
});
