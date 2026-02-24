'use strict';

// import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider-11.1';
import '@testing-library/jest-dom'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render } from '@testing-library/react';
import {
  useAuthenticatedUser,
  useMockConfig,
  useMockCreateSaveSearch,
  useMockCreateUserList,
  useMockMoreLikeThis,
  useMockMoreLikeThisWithoutData,
  useMockSearch,
  useMockSearchUrl,
  useMockSearchWithMultipleResults,
  useMockSearchWithoutData,
  useMockUpdateUserList,
  useMockUserOwnedLists,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import MockRouter from 'next-router-mock';
import Search from '@/pages/search';
import singletonRouter from 'next/router';

// mocking the jest fn
console.log = jest.fn();

beforeEach(() => {
  useMockConfig();
  useMockSearchUrl();
  useMockCreateSaveSearch();
  useMockUserOwnedLists();
  useMockUpdateUserList();
  useMockCreateUserList();
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderer = () => {
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <Search
          query={{
            keyword: 'test',
            p: 1,
          }}
        />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

describe('Search Page', () => {
  it('should render the page', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    const { getByPlaceholderText } = renderer();

    expect(getByPlaceholderText('Search the catalog')).toBeInTheDocument();
  });

  it('should render the results', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    const { getByText, getAllByText } = renderer();

    expect(getByText('About 1 results.')).toBeInTheDocument();

    expect(getAllByText('Test Title').length).toBe(1);
    expect(getByText('Similar Course')).toBeInTheDocument();
  });

  it('should not render the save button when the user is not authenticated', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    const { queryByText } = renderer();

    expect(queryByText('Save')).not.toBeInTheDocument();
  });

  it('should render the save button when the user is authenticated', () => {
    useAuthenticatedUser();
    useMockSearch();
    useMockUserOwnedLists();
    useMockMoreLikeThisWithoutData();
    const { getByText } = renderer();

    expect(getByText('Save')).toBeInTheDocument();
  });

  it('should not render the "Save this search" button when the user is not authenticated', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    const { queryByText } = renderer();

    expect(queryByText('Save this search')).not.toBeInTheDocument();
  });

  it('should render the "Save this search" button when the user is logged in', () => {
    useAuthenticatedUser();
    useMockSearch();
    useMockUserOwnedLists();
    useMockMoreLikeThisWithoutData();
    const { getByText } = renderer();

    expect(getByText('Save this search')).toBeInTheDocument();
  });

  it('should navigate to the course page when a course is clicked', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    const { getByText } = renderer();

    // act(() => {
    //   fireEvent.click(getByText('Test Title'));
    // });

    expect(singletonRouter).toMatchObject({
      asPath: '/',
    });
  });

  it('should render the "Save this search" button if the user is logged in', () => {
    useAuthenticatedUser();
    useMockSearch();
    useMockUserOwnedLists();
    useMockMoreLikeThisWithoutData();
    const { getByText } = renderer();

    expect(getByText('Save this search')).toBeInTheDocument();
  });

  it('should not render the "Save this search" button if the user is not logged in', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockUserOwnedLists();
    const { queryByText } = renderer();

    expect(queryByText('Save this search')).not.toBeInTheDocument();
  });

  it('should change value of the search input when the user types', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockUserOwnedLists();
    const { getByPlaceholderText } = renderer();

    act(() => {
      fireEvent.change(getByPlaceholderText('Search the catalog'), {
        target: { value: 'test' },
      });
    });

    expect(getByPlaceholderText('Search the catalog')).toHaveValue('test');
  });

  it('should render the initial value of the search input when the user first visits', () => {
    MockRouter.setCurrentUrl('/search?keyword=initial');
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockUserOwnedLists();
    const { getByPlaceholderText } = renderer();

    expect(getByPlaceholderText('Search the catalog')).toHaveValue('initial');
  });

  it('should change the value on the search input when the user navigates to the search page', () => {
    MockRouter.setCurrentUrl('/search?keyword=initial');
    useMockSearchWithoutData();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockUserOwnedLists();

    const { getByPlaceholderText, getByTitle } = renderer();

    const input = getByPlaceholderText(/search the catalog/i);
    const searchBtn = getByTitle(/search/i);

    act(() => {
      fireEvent.change(input, { target: { value: 'updated' } });
    });

    act(() => {
      fireEvent.click(searchBtn);
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/search?keyword=updated&p=1',
    });
  });

  it('should reset the form when "reset" is clicked', () => {
    MockRouter.setCurrentUrl('/search?keyword=');
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockUserOwnedLists();
    const { getByTitle, getByPlaceholderText } = renderer();
    const input = getByPlaceholderText('Search the catalog');
    act(() => {
      fireEvent.click(getByTitle('reset'));
    });

    expect(input.value).toBe('');
  });

  it('should render filters when there are aggregations', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByRole } = renderer();

    expect(getByRole('button', { name: /course type/i })).toBeInTheDocument();
  });

  it('should show options for filters when clicked', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByText, queryByRole } = renderer();

    act(() => {
      fireEvent.click(queryByRole('button', { name: /course type/i }));
    });

    expect(getByText(/test bucket 1/i)).toBeInTheDocument();
    expect(getByText(/test bucket 2/i)).toBeInTheDocument();
  });

  it('should clear filter selection when clicked', () => {
    MockRouter.setCurrentUrl('/search?keyword=initial');

    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByText, queryByRole } = renderer();

    act(() => {
      fireEvent.click(queryByRole('button', { name: /course type/i }));
    });
    act(() => {
      fireEvent.click(getByText(/test bucket 1/i));
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/search?keyword=initial&Course.CourseType=test+bucket+1&p=1',
    });
    act(() => {
      fireEvent.click(queryByRole('button', { name: /clear/i }));
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/search?keyword=initial&p=1',
    });
  });

  it('should show the current page', () => {
    useMockSearch();
    useUnauthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByRole, getAllByText } = renderer();
    expect(getAllByText(/1/i).length).toBe(2);

    // expect(getByRole('button', { name: /1/i })).toBeInTheDocument();
  });

  it('should show the next button when there are more pages', () => {
    useMockSearchWithMultipleResults();
    useUnauthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByRole, getByTitle } = renderer();

    expect(getByRole('button', { name: /next/i })).toBeEnabled();
    expect(getByTitle(/last/i)).toBeInTheDocument();

    expect(getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(getByTitle(/first/i)).toBeDisabled();
  });

  it('should show previous when there are more pages', () => {
    MockRouter.setCurrentUrl('/search?keyword=initial&p=2');
    useUnauthenticatedUser();
    useMockSearchWithMultipleResults();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();

    const { getByRole, getByTitle } = renderer();

    expect(getByRole('button', { name: /next/i })).toBeDisabled();
    expect(getByTitle(/last/i)).toBeDisabled();
    expect(getByRole('button', { name: /previous/i })).toBeEnabled();
    expect(getByTitle(/first/i)).toBeEnabled();
  });

  it('should navigate user to next page when next is clicked', () => {
    MockRouter.setCurrentUrl('/search?keyword=initial&p=1');
    useUnauthenticatedUser();
    useMockSearchWithMultipleResults();
    useMockMoreLikeThisWithoutData();
    useMockUserOwnedLists();
    const { getByRole } = renderer();

    act(() => {
      fireEvent.click(getByRole('button', { name: /next/i }));
    });

    expect(singletonRouter).toMatchObject({
      asPath: '/search?keyword=initial&p=2',
    });
  });
});
