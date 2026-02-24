'use strict';

import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@testing-library/react-hooks';
import mockAxios from 'jest-mock-axios';

import { useConfig } from '@/hooks/useConfig';
import uiConfigData from '@/__mocks__/data/uiConfig.data';

jest.unmock('@/hooks/useConfig');

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

jest.mock('axios');
test('should should return UI config data', async () => {
  mockAxios.get.mockResolvedValue({ data: uiConfigData });
  const { result, waitForNextUpdate } = renderHook(() => useConfig(), {
    wrapper,
  });

  await waitForNextUpdate(result.current.isSuccess);
  expect(result.current.data).toEqual(uiConfigData);
});
