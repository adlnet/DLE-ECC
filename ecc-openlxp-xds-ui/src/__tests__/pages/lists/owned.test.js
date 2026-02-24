'use strict';

import '@testing-library/jest-dom'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render } from '@testing-library/react';
import {
  useAuthenticatedUser,
  useMockConfig,
  useMockUserOwnedLists,
  useMockUserOwnedListsWith401,
  useMockUserOwnedListsWith403,
  useMockUserOwnedListsWithoutData,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import MockRouter from 'next-router-mock';
import Owned from '@/pages/lists/owned';
import singletonRouter from 'next/router';

const renderer = () => {
  MockRouter.setCurrentUrl('/lists/owned');
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <Owned />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

beforeEach(() => {
  useMockConfig();
});

// Tests
describe('User Owned Lists', () => {
  it('should render the page', () => {
    useAuthenticatedUser();
    useMockUserOwnedLists();
    const { getByText } = renderer();
    expect(getByText('My Lists')).toBeInTheDocument();
  });

  it('should navigate the user to "/" if not authenticated', () => {
    useUnauthenticatedUser();
    useMockUserOwnedLists();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });

  it('should navigate the user to "/401" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockUserOwnedListsWith401();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/401' });
  });

  it('should navigate the user to "/403" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockUserOwnedListsWith403();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/403' });
  });

  it('should navigate the user to "/lists/1" when the user clicks view', () => {
    useAuthenticatedUser();
    useMockUserOwnedLists();
    const { getByRole } = renderer();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'View' }));
    });
    expect(singletonRouter).toMatchObject({ asPath: '/lists/1' });
  });

  it('should navigate the user to "/lists/edit/1" when the user clicks edit', () => {
    useAuthenticatedUser();
    useMockUserOwnedLists();
    const { getByRole } = renderer();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'Edit' }));
    });
    expect(singletonRouter).toMatchObject({ asPath: '/lists/edit/1' });
  });

  it('should display the list', () => {
    useAuthenticatedUser();
    useMockUserOwnedLists();
    const { getByText } = renderer();
    expect(getByText('Test Title 1')).toBeInTheDocument();
  });

  it('should display the list', () => {
    useAuthenticatedUser();
    useMockUserOwnedListsWithoutData();
    const { getByText, queryByText } = renderer();
    expect(
      getByText('You are not subscribed to any lists.')
    ).toBeInTheDocument();
    expect(queryByText('Test Title 1')).not.toBeInTheDocument();
  });
});
