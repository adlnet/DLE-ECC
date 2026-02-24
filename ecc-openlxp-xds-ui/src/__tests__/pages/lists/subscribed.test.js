'use strict';

import { act, fireEvent, render } from '@testing-library/react';

import '@testing-library/jest-dom'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import {
  unsubscribeFromListMockFn,
  useAuthenticatedUser,
  useMockConfig,
  useMockSubscribeToList,
  useMockSubscribedLists,
  useMockSubscribedListsEmpty,
  useMockSubscribedListsWith401,
  useMockSubscribedListsWith403,
  useMockUnsubscribeFromList,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import MockRouter from 'next-router-mock';
import Subscribed from '@/pages/lists/subscribed';
import singletonRouter from 'next/router';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

// mocks
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/useUnsubscribeFromList', () => ({
  useUnsubscribeFromList: jest.fn(),
}));

jest.mock('@/hooks/useSubscribedLists', () => ({
  useSubscribedLists: jest.fn(),
}));

beforeEach(() => {
  useMockConfig();
  useMockUnsubscribeFromList();
  useMockSubscribeToList();
});

const renderer = () => {
  MockRouter.setCurrentUrl('/lists/subscribed');
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <Subscribed />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

describe('User Subscribed Lists', () => {
  it('should render the page', () => {
    useAuthenticatedUser();
    useMockSubscribedLists();
    const { getByText } = renderer();
    expect(getByText('Subscribed Lists')).toBeInTheDocument();
  });

  it('should navigate the user to "/" if not authenticated', () => {
    useUnauthenticatedUser();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });

  it('should navigate the user to "/401" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockSubscribedListsWith401();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/401' });
  });

  it('should navigate the user to "/403" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockSubscribedListsWith403();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/403' });
  });

  it('should call the api to unsubscribe from the list', () => {
    useAuthenticatedUser();
    useMockSubscribedLists();
    const { getByText } = renderer();
    fireEvent.click(getByText('Unsubscribe'));
    expect(unsubscribeFromListMockFn).toHaveBeenCalled();
  });

  it('should navigate the user to "/lists/1" when the user clicks view', () => {
    useAuthenticatedUser();
    useMockSubscribedLists();
    const { getByRole } = renderer();
    act(() => {
      fireEvent.click(getByRole('button', { name: 'View' }));
    });
    expect(singletonRouter).toMatchObject({ asPath: '/lists/1' });
  });

  it('should show a message when list is empty', () => {
    useAuthenticatedUser();
    useMockSubscribedListsEmpty();
    const { getByText } = renderer();
    expect(
      getByText('You are not subscribed to any lists.')
    ).toBeInTheDocument();
  });
});
