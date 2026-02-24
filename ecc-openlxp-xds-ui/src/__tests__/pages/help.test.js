'use strict';

import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import { useAuthenticatedUser, useMockConfig } from '@/__mocks__/predefinedMocks';
import Help from '../../pages/help';

const queryClient = new QueryClient();
const renderer = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Help />
    </QueryClientProvider>
  );
};

describe('Help Page', () => {
  it('should render the page', () => {
    useAuthenticatedUser();
    useMockConfig();
    const { getByText } = renderer();
    expect(getByText('Purpose')).toBeInTheDocument();
    expect(getByText('Features')).toBeInTheDocument();
    expect(getByText('Course Providers')).toBeInTheDocument();
  });
});
