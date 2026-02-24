'use strict';

import '@testing-library/jest-dom'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import {
  deleteSaveSearchMockFn,
  useAuthenticatedUser,
  useMockConfig,
  useMockDeleteSaveSearch,
  useMockSavedSearchList,
  useMockSavedSearchWith401,
  useMockSavedSearchWith403,
  useMockSavedSearchWithoutData,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import { fireEvent, render } from '@testing-library/react';
import SavedSearches from '@/pages/lists/savedSearches';
import singletonRouter from 'next/router';

// renderer
const renderer = () => {
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <SavedSearches />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

beforeEach(() => {
  useMockConfig();
  useMockDeleteSaveSearch();
});

describe('User Saved Searches', () => {
  it('should render the page', () => {
    useAuthenticatedUser();
    useMockSavedSearchList();
    const { getByText } = renderer();
    expect(getByText('Saved Searches')).toBeInTheDocument();
  });

  it('should navigate user to "/" if not authenticated', () => {
    useUnauthenticatedUser();
    useMockSavedSearchList();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });

  it('should navigate user to "/401" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockSavedSearchWith401();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/401' });
  });

  it('should navigate user to "/403" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockSavedSearchWith403();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/403' });
  });

  it('should show a message when there are no saved searches', () => {
    useAuthenticatedUser();
    useMockSavedSearchWithoutData();
    const { getByText } = renderer();
    expect(getByText('You have no saved searches')).toBeInTheDocument();
  });

  it('should render a list of saved searches', () => {
    useAuthenticatedUser();
    useMockSavedSearchList();
    const { getByText } = renderer();
    expect(getByText('Saved Search 1')).toBeInTheDocument();
    expect(getByText('query')).toBeInTheDocument();
  });

  it('should navigate to the saved search when the user clicks on it', () => {
    useAuthenticatedUser();
    useMockSavedSearchList();
    const { getByText } = renderer();
    fireEvent.click(getByText('View'));
    expect(singletonRouter).toMatchObject({ asPath: '/search?keyword=query' });
  });

  it('should call the delete api when the user clicks on delete', () => {
    useAuthenticatedUser();
    useMockSavedSearchList();
    const { getByText } = renderer();
    fireEvent.click(getByText('Delete'));
    expect(deleteSaveSearchMockFn).toHaveBeenCalled();
  });
});
