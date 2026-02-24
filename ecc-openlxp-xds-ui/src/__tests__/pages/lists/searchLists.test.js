'use strict';

import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import MockRouter from 'next-router-mock';
import SearchLists from '@/pages/lists/searchLists';
import singletonRouter from 'next/router';

import '@testing-library/jest-dom';
import {
  subscribeToListMockFn,
  unsubscribeFromListMockFn,
  useAuthenticatedUser,
  useMockConfig,
  useMockInterestLists,
  useMockInterestListsEmpty,
  useMockInterestListsWith401,
  useMockInterestListsWith403,
  useMockSubscribeToList,
  useMockSubscribedLists,
  useMockSubscribedListsEmpty,
  useMockUnsubscribeFromList,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import { useSubscribeToList } from '@/hooks/useSubscribeToList';

beforeEach(() => {
  useMockConfig();
});

afterEach(cleanup);

const renderer = () => {
  MockRouter.setCurrentUrl('/lists/searchLists');
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <SearchLists />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

describe('Search Lists', () => {
  it('should render the title', () => {
    useAuthenticatedUser();
    useMockInterestListsEmpty();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    expect(getByText(/search list catalog/i)).toBeInTheDocument();
  });

  it('should navigate user to "/" when not authenticated', () => {
    useUnauthenticatedUser();
    useMockInterestListsEmpty();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    expect(singletonRouter).toMatchObject({
      asPath: '/',
    });
  });

  it('should navigate a user to "401" page when user has no permissions', () => {
    useAuthenticatedUser();
    useMockInterestListsWith401();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    expect(singletonRouter).toMatchObject({
      asPath: '/401',
    });
  });

  it('should navigate a user to "403" page when user has no permissions', () => {
    useAuthenticatedUser({});
    useMockInterestListsWith403({});
    useMockSubscribedListsEmpty({});
    useMockSubscribeToList({});
    useMockUnsubscribeFromList({});
    const { getByText } = renderer();
    expect(singletonRouter).toMatchObject({
      asPath: '/403',
    });
  });

  it('should render the list of interest lists', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText, queryAllByText } = renderer();
    expect(getByText('Test List 1')).toBeInTheDocument();
    expect(queryAllByText('Subscribe').length).toBe(10);
  });

  it('should render the list of interest lists and show unsubscribe', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedLists();
    useSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();

    expect(getByText('Test List 1')).toBeInTheDocument();
    expect(getByText('Unsubscribe')).toBeInTheDocument();
  });

  it('should render the next and previous buttons', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('Prev')).toBeInTheDocument();
    expect(getByText('Prev')).toBeDisabled();
  });

  it('should navigate to next page', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    act(() => {
      fireEvent.click(getByText('Next'));
    });

    expect(getByText('Prev')).toBeInTheDocument();
    expect(getByText('Prev')).toBeEnabled();
    expect(getByText('Next')).toBeInTheDocument();
    expect(getByText('Next')).toBeDisabled();
  });

  it('should navigate to previous page', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    act(() => {
      fireEvent.click(getByText('Next'));
    });
    expect(getByText('Prev')).toBeInTheDocument();
    expect(getByText('Prev')).toBeEnabled();
    act(() => {
      fireEvent.click(getByText('Prev'));
    });
    expect(getByText('Prev')).toBeInTheDocument();
    expect(getByText('Prev')).toBeDisabled();
  });

  it('should only show results that contain the search term', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByPlaceholderText, queryAllByText } = renderer();
    act(() => {
      fireEvent.change(getByPlaceholderText('Search the catalog'), {
        target: { value: '11' },
      });
    });
    expect(queryAllByText(/Test List/i)).toHaveLength(1);
  });

  it('should reset the search query when the reset button is clicked', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByTitle, getByPlaceholderText, queryAllByText } = renderer();
    act(() => {
      fireEvent.change(getByPlaceholderText('Search the catalog'), {
        target: { value: '11' },
      });
    });
    expect(queryAllByText(/Test List/i)).toHaveLength(1);
    act(() => {
      fireEvent.click(getByTitle('reset'));
    });

    expect(queryAllByText(/Test List/i)).toHaveLength(10);
  });

  it('should show the number of results being shown', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { queryByText } = renderer();
    expect(queryByText(/1-10/i)).toBeInTheDocument();
  });

  it('should show the number of results being shown when there are less than 10', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText, getByPlaceholderText } = renderer();
    act(() => {
      fireEvent.change(getByPlaceholderText('Search the catalog'), {
        target: { value: '11' },
      });
    });

    expect(getByText(/1-1/i)).toBeInTheDocument();
  });

  it('should show the "0" if there are no matches', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText, getByPlaceholderText } = renderer();
    act(() => {
      fireEvent.change(getByPlaceholderText('Search the catalog'), {
        target: { value: 'no matches' },
      });
    });

    expect(getByText(/0/i)).toBeInTheDocument();
  });

  it('should navigate user to list when clicked', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getByText } = renderer();
    act(() => {
      fireEvent.click(getByText('Test List 1'));
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/lists/1',
    });
  });

  it('should call the subscribeToList function when clicked', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedListsEmpty();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getAllByText } = renderer();
    act(() => {
      fireEvent.click(getAllByText('Subscribe')[0]);
    });

    expect(subscribeToListMockFn).toHaveBeenCalled();
  });

  it('should call the unsubscribeFromList function when clicked', () => {
    useAuthenticatedUser();
    useMockInterestLists();
    useMockSubscribedLists();
    useMockSubscribeToList();
    useMockUnsubscribeFromList();
    const { getAllByText } = renderer();
    act(() => {
      fireEvent.click(getAllByText('Unsubscribe')[0]);
    });

    expect(unsubscribeFromListMockFn).toHaveBeenCalled();
  });
});
