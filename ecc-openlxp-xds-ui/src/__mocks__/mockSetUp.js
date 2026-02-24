'use strict';

// mock useRouter
jest.mock('next/dist/client/router', () => require('next-router-mock'));

// mocking useUserList
jest.mock('@/hooks/useUserList', () => ({
  useUserList: jest.fn(),
}));

// mocking useUpdateUserList
jest.mock('@/hooks/useUpdateUserList', () => ({
  useUpdateUserList: jest.fn(),
}));

// mocking the useList hook
jest.mock('@/hooks/useList', () => ({
  useList: jest.fn(),
}));

// mocking the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// mocking the useInterestLists Hook
jest.mock('@/hooks/useInterestLists', () => ({
  useInterestLists: jest.fn(),
}));

// mocking the useSubscribedLists Hook
jest.mock('@/hooks/useSubscribedLists', () => ({
  useSubscribedLists: jest.fn(),
}));

// mocking the useSubscribeToList Hook
jest.mock('@/hooks/useSubscribeToList', () => ({
  useSubscribeToList: jest.fn(),
}));

// mocking the useUnsubscribeFromList Hook
jest.mock('@/hooks/useUnsubscribeFromList', () => ({
  useUnsubscribeFromList: jest.fn(),
}));

// mock useInterestLists
jest.mock('@/hooks/useInterestLists', () => ({
  useInterestLists: jest.fn(),
}));

// mock useSubscribedLists
jest.mock('@/hooks/useSubscribedLists', () => ({
  useSubscribedLists: jest.fn(),
}));

// mock useUnsubscribeFromList
jest.mock('@/hooks/useUnsubscribeFromList', () => ({
  useUnsubscribeFromList: jest.fn(),
}));

// mock useSubscribeToList
jest.mock('@/hooks/useSubscribeToList', () => ({
  useSubscribeToList: jest.fn(),
}));

// mock useUserOwnedLists
jest.mock('@/hooks/useUserOwnedLists', () => ({
  useUserOwnedLists: jest.fn(),
}));

// mock useCourse
jest.mock('@/hooks/useCourse', () => ({
  useCourse: jest.fn(),
}));

// mocking config
// jest.mock('@/hooks/useConfig', () => ({
//   useConfig: jest.fn(),
// }));

// mocking useMoreLikeThis
jest.mock('@/hooks/useMoreCoursesLikeThis', () => ({
  useMoreCoursesLikeThis: jest.fn(),
}));

jest.mock('@/hooks/useCreateUserList', () => ({
  useCreateUserList: jest.fn(),
}));

jest.mock('@/hooks/useCreateSaveSearch', () => ({
  useCreateSaveSearch: jest.fn(),
}));

// mock useDeleteSavedSearch
jest.mock('@/hooks/useDeleteSavedSearch', () => ({
  useDeleteSavedSearch: jest.fn(),
}));

// mock useSaveSearchList
jest.mock('@/hooks/useSaveSearch', () => ({
  useSaveSearchList: jest.fn(),
}));

jest.mock('@/hooks/useSearchUrl', () => ({
  useSearchUrl: jest.fn(),
}));

jest.mock('@/hooks/useSearch', () => ({
  useSearch: jest.fn(),
}));

// mocking the interaction observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

jest.mock('@/hooks/useConfig', () => ({
  useConfig: jest.fn(() => ({
    data: {
      course_information: {
        course_title: 'Course.CourseTitle',
        course_description: 'Course.CourseShortDescription',
        course_provider: 'Course.CourseProviderName',
      },
    },
  })),
}));
