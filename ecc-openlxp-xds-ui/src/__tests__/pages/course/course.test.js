'use strict';

import '@testing-library/jest-dom'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render } from '@testing-library/react';
import {
  useAuthenticatedUser,
  useMockConfig,
  useMockConfigWithFailure,
  useMockCourse,
  useMockCourseWithFailure,
  useMockCourseWithoutData,
  useMockCreateUserList,
  useMockMoreLikeThis,
  useMockMoreLikeThisWithoutData,
  useMockUpdateUserList,
  useMockUserOwnedLists,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import Course from '@/pages/course/[courseId]';
import MockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

const renderer = (isAuth = false) => {
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <Course />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

beforeEach(() => {
  useMockConfig();
  useMockUserOwnedLists();
  useMockUpdateUserList();
  useMockCreateUserList();
});

describe('Course Page', () => {
  it('should render the component', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    expect(screen.getByText('Go to Enrollment')).toBeInTheDocument();
  });

  it('should render the component with no auth', () => {
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer(false);

    expect(screen.getByText('Go to Enrollment')).toBeInTheDocument();
  });

  it("should render course data if it's available", () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Short Description')).toBeInTheDocument();
    expect(screen.getByText('2023-03-20')).toBeInTheDocument();
    expect(screen.getByText('2023-03-21')).toBeInTheDocument();
    expect(screen.getByAltText('Course')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(
      screen.getByAltText('Course').src.includes('Test_Thumbnail')
    ).toBeTruthy();
    expect(screen.getByText('Go to Enrollment').href).toBe(
      'https://www.test.com/'
    );
  });

  it('should display a save course button if the user is authenticated', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    expect(screen.getByText('Save Course')).toBeEnabled();
  });

  it('should not display a save course button if the user is not authenticated', () => {
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    // expect(screen.queryByText('Save Course')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Course')).toBeDisabled();
  });

  it('should display "Not Available" if specific course data is not available', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourseWithoutData();
    const screen = renderer();

    // number of elements on the page that can render the message
    expect(screen.queryAllByText('Not Available').length).toBe(10);
  });

  it('should display "Not Available" if config is not available', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourseWithoutData();
    useMockConfigWithFailure();
    const screen = renderer();

    // number of elements on the page that can render the message
    // only 8 because details info will not be run
    expect(screen.queryAllByText('Not Available').length).toBe(8);
  });

  it('should display "Not Available" if course data is not available', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourseWithFailure();
    useMockConfig();
    const screen = renderer();

    // number of elements on the page that can render the message
    // only 8 because details info will not be run
    expect(screen.queryAllByText('Not Available').length).toBe(8);
  });

  it('should display a "Related Courses" section if the user is authenticated', () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    expect(screen.getByText('Related Courses')).toBeInTheDocument();
    expect(screen.getByText('More Like This Title')).toBeInTheDocument();
    expect(
      screen.getByText('More Like This Provider Name')
    ).toBeInTheDocument();
  });

  it('should display a "Related Courses" section if the user is not authenticated', () => {
    useUnauthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    expect(screen.getByText('Related Courses')).toBeInTheDocument();
    expect(screen.getByText('More Like This Title')).toBeInTheDocument();
    expect(
      screen.getByText('More Like This Provider Name')
    ).toBeInTheDocument();
  });

  it('should not display a "Related Courses" section if the there is no data', () => {
    useAuthenticatedUser();
    useMockMoreLikeThisWithoutData();
    useMockCourse();
    const screen = renderer();
    expect(screen.queryByText('More Like This Title')).not.toBeInTheDocument();
  });

  it("should navigate to the course page on click of a related course's link", () => {
    useAuthenticatedUser();
    useMockMoreLikeThis();
    useMockCourse();
    const screen = renderer();

    const relatedCourseLink = screen.getByText('More Like This Title');
    act(() => {
      fireEvent.click(relatedCourseLink);
    });
    expect(singletonRouter).toMatchObject({ asPath: '/course/more_like_this' });
  });
});
