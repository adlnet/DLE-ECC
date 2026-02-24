'use strict';

// import jest from 'jest';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/hooks/useConfig';
import { useCourse } from '@/hooks/useCourse';
import { useCreateSaveSearch } from '@/hooks/useCreateSaveSearch';
import { useCreateUserList } from '@/hooks/useCreateUserList';
import { useDeleteSavedSearch } from '@/hooks/useDeleteSavedSearch';
import { useInterestLists } from '@/hooks/useInterestLists';
import { useList } from '@/hooks/useList';
import { useMoreCoursesLikeThis } from '@/hooks/useMoreCoursesLikeThis';
import { useSaveSearchList } from '@/hooks/useSaveSearch';
import { useSearch } from '@/hooks/useSearch';
import { useSearchUrl } from '@/hooks/useSearchUrl';
import { useSubscribeToList } from '@/hooks/useSubscribeToList';
import { useSubscribedLists } from '@/hooks/useSubscribedLists';
import { useUnsubscribeFromList } from '@/hooks/useUnsubscribeFromList';
import { useUpdateUserList } from '@/hooks/useUpdateUserList';
import { useUserList } from '@/hooks/useUserList';
import { useUserOwnedLists } from '@/hooks/useUserOwnedLists';

/**
 *
 * @returns {{
 * data: {
 * id: '1',
 * name: 'Test List',
 * owner: {
 * id: '1',
 * username: '',
 * email: 'test@test.com',
 * },
 * description: 'test description',
 * experiences: [],
 * },
 * isSuccess: true,
 * isError: false,
 * }}
 */

export function useListMock() {
  return useList.mockImplementation(() => ({
    data: {
      id: '1',
      name: 'Test List',
      owner: {
        id: '1',
        username: '',
        email: 'test@test.com',
      },
      description: 'test description',
      experiences: [
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
          },
          meta: {
            id: '1',
            metadata_key_hash: '1',
          },
        },
      ],
    },
    isSuccess: true,
    isError: false,
  }));
}

/**
 * @returns {{
 * data:{
 * id: '1',
 * name: 'Test List',
 * owner: {
 * id: '1',
 * username: '',
 * email: 'test@test.com',
 * },
 * description: 'test description',
 * experiences: [],
 * },
 * isSuccess: true,
 * isError: false,
 * }}
 */

export function useListMockWithNoExperiences() {
  return useList.mockImplementation(() => ({
    data: {
      id: '1',
      name: 'Test List',
      owner: {
        id: '1',
        username: '',
        email: 'test@test.com',
      },
      description: 'test description',
      experiences: [],
    },
    isSuccess: true,
    isError: false,
  }));
}

/**
 *
 * @returns {{
 * data:{},
 * isSuccess: false,
 * isError: true,
 * error: {
 * response: {
 * status: 401,
 * },
 * },
 * }}
 */

export function useListMockWith401() {
  return useList.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));
}

/**
 *
 * @returns {{
 * data:{},
 * isSuccess: false,
 * isError: true,
 * error: {
 * response: {
 * status: 403,
 * },
 * },
 * }}
 */

export function useListMockWith403() {
  return useList.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

/**
 *
 * @returns {{
 * user: {
 * user: {
 * id: '1',
 * username: 'test',
 * email: 'test@test.com',
 * },
 * },
 * }}
 */

export const useAuthenticatedUser = () =>
  useAuth.mockImplementation(() => ({
    user: {
      user: {
        id: '1',
        username: 'test',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@test.com',
      },
    },
    login: jest.fn(),
    logout: jest.fn(),
  }));

/**
 *
 * @returns
 *
 */

export const logoutFn = jest.fn();
export const loginFn = jest.fn();
export const useUnauthenticatedUser = () =>
  useAuth.mockReturnValue({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
  });

export function useMockInterestLists() {
  return useInterestLists.mockImplementation(() => ({
    data: [
      {
        id: '1',
        name: 'Test List 1',
        owner: {
          id: '1',
          username: '',
          email: 'fake1@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '2',
        name: 'Test List 2',
        owner: {
          id: '2',
          username: '',
          email: 'fake@test.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '3',
        name: 'Test List 3',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '4',
        name: 'Test List 4',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],

        experiences: [],
      },
      {
        id: '5',
        name: 'Test List 5',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '6',
        name: 'Test List 6',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '7',
        name: 'Test List 7',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '8',
        name: 'Test List 8',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '9',
        name: 'Test List 9',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '10',
        name: 'Test List 10',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
      {
        id: '11',
        name: 'Test List 11',
        owner: {
          id: '2',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
    ],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockInterestListsEmpty() {
  return useInterestLists.mockImplementation(() => ({
    data: [],
    isSuccess: true,
    isError: false,
  }));
}

export const useMockInterestListsWith401 = () =>
  useInterestLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));

export function useMockInterestListsWith403() {
  return useInterestLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

export const useMockSubscribedLists = () =>
  useSubscribedLists.mockImplementation(() => ({
    data: [
      {
        id: '1',
        name: 'Test List 1',
        owner: {
          id: '1',
          username: '',
          email: 'fake@user.com',
        },
        description: 'test description',
        subscribers: [],
        experiences: [],
      },
    ],
    isSuccess: true,
    isError: false,
  }));

export function useMockSubscribedListsEmpty() {
  return useSubscribedLists.mockImplementation(() => ({
    data: [],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockSubscribedListsWith401() {
  return useSubscribedLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));
}

export function useMockSubscribedListsWith403() {
  return useSubscribedLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

export const unsubscribeFromListMockFn = jest.fn();
export const subscribeToListMockFn = jest.fn();

export function useMockUnsubscribeFromList() {
  return useUnsubscribeFromList.mockImplementation(() => ({
    mutate: unsubscribeFromListMockFn,
  }));
}

export function useMockSubscribeToList() {
  return useSubscribeToList.mockImplementation(() => ({
    mutate: subscribeToListMockFn,
  }));
}

export function useMockUserList() {
  return useUserList.mockImplementation(() => ({
    data: {
      id: '1',
      name: 'Test List',
      owner: {
        id: '1',
        username: '',
        email: 'test@test.com',
      },
      description: 'test description',
      experiences: [
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
          },
          meta: {
            id: '1',
            metadata_key_hash: '1',
          },
        },
      ],
    },
    isSuccess: true,
    isError: false,
  }));
}

export function useMockUserListWith401() {
  return useUserList.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));
}

export function useMockUserListWith403() {
  return useUserList.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

export function useMockUserListEmpty() {
  return useUserList.mockImplementation(() => ({
    data: {},
    isSuccess: true,
    isError: false,
  }));
}

export const updateListMockFn = jest.fn();
export function useMockUpdateUserList() {
  return useUpdateUserList.mockImplementation(() => ({
    mutate: updateListMockFn,
  }));
}

export function useMockUserOwnedLists() {
  return useUserOwnedLists.mockImplementation(() => ({
    data: [
      {
        id: 1,
        owner: {
          id: 1,
          email: 'test@test.com',
          first_name: '',
          last_name: '',
        },
        subscribers: [],
        created: '2021-10-22T22:23:26.832209Z',
        modified: '2021-10-26T12:08:21.845982Z',
        description: 'Description',
        name: 'Test Title 1',
        experiences: ['12345', '67891'],
      },
    ],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockUserOwnedListsWithoutData() {
  return useUserOwnedLists.mockImplementation(() => ({
    data: [],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockUserOwnedListsWith401() {
  return useUserOwnedLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));
}

export function useMockUserOwnedListsWith403() {
  return useUserOwnedLists.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

export function useMockCourse() {
  return useCourse.mockImplementation(() => ({
    data: {
      Course: {
        CourseTitle: 'Test Title',
        CourseProviderName: 'Course Provider Name',
        CourseShortDescription: 'Test Short Description',
        CourseCode: 'Test Code',
        CourseURL: 'https://www.test.com',
        CourseSectionDeliveryMode: 'Online',
      },
      Course_Instance: {
        Thumbnail: 'Test_Thumbnail',
        StartDate: '2023-03-20T16:00:00Z',
        EndDate: '2023-03-21T16:00:00Z',
      },
      meta: {
        id: '1',
        metadata_key_hash: '1',
      },
    },
    isSuccess: true,
    isError: false,
  }));
}

export function useMockCourseWithoutData() {
  return useCourse.mockImplementation(() => ({
    data: {},
    isSuccess: true,
    isError: false,
  }));
}
export function useMockCourseWithFailure() {
  return useCourse.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 404,
      },
    },
  }));
}

export function useMockConfig() {
  return useConfig.mockImplementation(() => ({
    data: {
      course_highlights: [
        {
          display_name: 'Course Code',
          field_name: 'Course.CourseCode',
          active: true,
        },
        {
          display_name: 'Course Code',
          field_name: 'Course.CourseCode',
          active: false,
        },
      ],
      course_information: {
        course_title: 'Course.CourseTitle',
        course_description: 'Course.CourseShortDescription',
        course_url: 'Course.CourseURL',
        course_code: 'Course.CourseCode',
        course_provider: 'Course.CourseProviderName',
        course_startDate: 'Course_Instance.StartDate',
        course_endDate: 'Course_Instance.EndDate',
        course_instructor: 'Course_Instance.Instructor',
        course_deliveryMode: 'Course.CourseSectionDeliveryMode',
      },
      course_img_fallback: 'some/fallback',
      search_results_per_page: 10,
      single_sign_on_options: [
        {
          name: 'Google',
          path: 'test.com',
        },
      ],
    },
    isSuccess: true,
    isError: false,
  }));
}
export function useMockConfigWithFailure() {
  return useConfig.mockImplementation(() => ({
    data: {},
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 404,
      },
    },
  }));
}

export function useMockMoreLikeThis() {
  return useMoreCoursesLikeThis.mockImplementation(() => ({
    data: {
      hits: [
        {
          Course: {
            CourseTitle: 'More Like This Title',
            CourseProviderName: 'More Like This Provider Name',
            CourseShortDescription: 'More Like This Short Description',
            CourseCode: 'More Like This Code',
          },
          Course_Instance: {
            Thumbnail: 'More Like This Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-20T16:00:00Z',
          },
          meta: {
            id: '1',
            metadata_key_hash: 'more_like_this',
          },
        },
      ],
    },
    isSuccess: true,
    isError: false,
  }));
}

export function useMockMoreLikeThisWithoutData() {
  return useMoreCoursesLikeThis.mockImplementation(() => ({
    data: { hits: [] },
    isSuccess: true,
    isError: false,
  }));
}

export const createUserListMockFn = jest.fn();
export function useMockCreateUserList() {
  return useCreateUserList.mockImplementation(() => ({
    mutate: createUserListMockFn,
  }));
}

export const createSaveSearchMockFn = jest.fn();
export function useMockCreateSaveSearch() {
  return useCreateSaveSearch.mockImplementation(() => ({
    mutate: createSaveSearchMockFn,
  }));
}

export const deleteSaveSearchMockFn = jest.fn();
export function useMockDeleteSaveSearch() {
  useDeleteSavedSearch.mockImplementation(() => ({
    mutate: deleteSaveSearchMockFn,
  }));
}

export function useMockSavedSearchList() {
  return useSaveSearchList.mockImplementation(() => ({
    data: [
      {
        id: 'searchId',
        name: 'Saved Search 1',
        query: '/search?keyword=query',
        createdAt: '2020-01-01',
      },
    ],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockSavedSearchWithoutData() {
  return useSaveSearchList.mockImplementation(() => ({
    data: [],
    isSuccess: true,
    isError: false,
  }));
}

export function useMockSavedSearchWith401() {
  return useSaveSearchList.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 401,
      },
    },
  }));
}

export function useMockSavedSearchWith403() {
  return useSaveSearchList.mockImplementation(() => ({
    data: [],
    isSuccess: false,
    isError: true,
    error: {
      response: {
        status: 403,
      },
    },
  }));
}

export function useMockSearch() {
  return useSearch.mockImplementation(() => ({
    url: 'https://www.test.com',
    setUrl: jest.fn(),
    data: {
      hits: [
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '1',
            metadata_key_hash: '1',
          },
        },
      ],
      aggregations: {
        'Course Type': {
          doc_count_error_upper_bound: 0,
          sum_other_doc_count: 0,
          buckets: [
            {
              key: 'test bucket 1',
              doc_count: 30,
            },
            {
              key: 'test bucket 2',
              doc_count: 20,
            },
          ],
          field_name: 'Course.CourseType',
        },
      },
      total: 1,
    },
    isSuccess: true,
    isError: false,
    refetch: jest.fn(),
  }));
}

export function useMockSearchWithMultipleResults() {
  return useSearch.mockImplementation(() => ({
    url: 'https://www.test.com',
    setUrl: jest.fn(),
    data: {
      // 11 results
      hits: [
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '2',
            metadata_key_hash: '2',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '3',
            metadata_key_hash: '3',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '4',
            metadata_key_hash: '4',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '5',
            metadata_key_hash: '5',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '6',
            metadata_key_hash: '6',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '7',
            metadata_key_hash: '7',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '8',
            metadata_key_hash: '8',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '9',
            metadata_key_hash: '9',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '10',
            metadata_key_hash: '10',
          },
        },
        {
          Course: {
            CourseTitle: 'Test Title',
            CourseProviderName: 'Course Provider Name',
            CourseShortDescription: 'Test Short Description',
            CourseCode: 'Test Code',
            CourseURL: 'https://www.test.com',
            CourseSectionDeliveryMode: 'Online',
          },
          Course_Instance: {
            Thumbnail: 'Test_Thumbnail',
            StartDate: '2023-03-20T16:00:00Z',
            EndDate: '2023-03-21T16:00:00Z',
          },
          meta: {
            id: '11',
            metadata_key_hash: '11',
          },
        },
      ],
      total: 11,
      aggregations: {},
    },
    isSuccess: true,
    isError: false,
    refetch: jest.fn(),
  }));
}

export function useMockSearchWithoutData() {
  return useSearch.mockImplementation(() => ({
    url: 'https://www.test.com',
    setUrl: jest.fn(),
    data: {
      hits: [],
      total: 1,
      aggregations: {},
    },
    isSuccess: true,
    isError: false,
    refetch: jest.fn(),
  }));
}

export function useMockSearchUrl() {
  return useSearchUrl.mockImplementation(() => ({
    url: 'https://www.test.com',
    setUrl: jest.fn(),
  }));
}

/** @returns {{
    data: {
      id: '1',
      owner: {
        id: '1337',
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      },
      subscribers: [],
      created: '2020-03-20T16:00:00Z',
      description: 'test description',
      name: 'test name',
      public: true,
      experiences: [],
    },
    isSuccess: true,
    isError: false,
  }}
 */

export function useMockUserListWithDifferentUserId() {
  return useUserList.mockImplementation(() => ({
    data: {
      id: '1',
      owner: {
        id: '1337',
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User',
      },
      subscribers: [],
      created: '2020-03-20T16:00:00Z',
      description: 'test description',
      name: 'test name',
      public: true,
      experiences: [],
    },
    isSuccess: true,
    isError: false,
  }));
}
