'use strict';

import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';

import mockAxios from 'jest-mock-axios';

import { useMoreCoursesLikeThis } from '@/hooks/useMoreCoursesLikeThis';
import searchData from '@/__mocks__/data/search.data';

const queryClient = new QueryClient();

jest.unmock('@/hooks/useMoreCoursesLikeThis');

// wrapper function for queryClient
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

it('should return a list of courses like based on the id', async () => {
  mockAxios.get.mockResolvedValue({ data: searchData });
  const { result, waitForNextUpdate } = renderHook(
    () => useMoreCoursesLikeThis('123'),
    { wrapper }
  );

  await waitForNextUpdate(result.current.isSuccess);
  expect(result.current.data).toEqual(searchData);
});
