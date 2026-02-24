'use strict';

import '@testing-library/jest-dom'
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render } from '@testing-library/react';
import {
  useAuthenticatedUser,
  useMockCreateUserList,
  useMockUpdateUserList,
  useMockUserOwnedListsWithoutData,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import SearchResult from '@/components/cards/SearchResult';
import courseData from '@/__mocks__/data/course.data';
import singletonRouter from 'next/router';

const renderer = (props) => {
  return render(
    <QueryClientWrapper>
      <SearchResult result={courseData} />
    </QueryClientWrapper>
  );
};

beforeEach(() => {
  useMockUserOwnedListsWithoutData();
  useMockUpdateUserList();
  useMockCreateUserList();
});

describe('SearchResult', () => {
  it('renders the course data', () => {
    useAuthenticatedUser();
    const screen = renderer();
    expect(screen.getByText('Test Course Title'));
    expect(screen.getByText('Provider Name'));
    expect(screen.getByText('Short Description'));
  });

  it('should show the save button when a user is authenticated', () => {
    useAuthenticatedUser();
    const screen = renderer();
    expect(screen.getByText('Save'));
  });

  it('should not show the save button when a user is not authenticated', () => {
    useUnauthenticatedUser();
    const screen = renderer();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('should navigate user to the course page when clicked', () => {
    useAuthenticatedUser();
    const screen = renderer();
    act(() => {
      fireEvent.click(screen.getByText('Test Course Title'));
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/course/123456',
    });
  });
});
