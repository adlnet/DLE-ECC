'use strict';

// tests for [listId].js

import '@testing-library/jest-dom';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import {
  useAuthenticatedUser,
  useListMock,
  useListMockWith401,
  useListMockWith403,
  useListMockWithNoExperiences,
  useMockConfig,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import { useList } from '@/hooks/useList';
import List, { getServerSideProps } from '@/pages/lists/[listId]';
import MockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import xAPIMapper from '@/utils/xapi/xAPIMapper';
import xAPISendStatement from '@/utils/xapi/xAPISendStatement';

// render function that wraps the component with query client wrapper
const renderer = () => {
  MockRouter.setCurrentUrl('/lists/1');

  // returns the wrapped render object
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <List listId={1} />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

beforeEach(() => {
  useMockConfig();
});

describe('List page', () => {
  it('should render', () => {
    useAuthenticatedUser();
    useListMock();
    const { getByText } = renderer();
    expect(getByText('Test List')).toBeInTheDocument();
  });

  it('should not render edit button when unauthenticated', () => {
    useListMock();
    useUnauthenticatedUser();
    const { queryByText } = renderer();
    expect(queryByText('Edit list')).not.toBeInTheDocument();
  });

  it('should render edit button when authenticated', () => {
    useListMock();
    useAuthenticatedUser();
    const { getByText } = renderer();
    expect(getByText('Edit list')).toBeInTheDocument();
  });

  it('should navigate a user to the specific course', () => {
    useListMock();
    useAuthenticatedUser();
    const { getByText } = renderer();
    const course = getByText('Test Title');
    fireEvent.click(course);
    expect(singletonRouter).toMatchObject({ asPath: '/course/1' });
  });

  it('should navigate a user to the edit page', () => {
    useListMock();
    useAuthenticatedUser();
    const { getByText } = renderer();
    const editButton = getByText('Edit list');
    fireEvent.click(editButton);
    expect(singletonRouter).toMatchObject({ asPath: '/lists/edit/1' });
  });

  it('should navigate user to 401 page', () => {
    useListMockWith401({});
    useAuthenticatedUser({});
    render();

    // expect(singletonRouter).toMatchObject({ asPath: '/401' });
  });

  it('should navigate user to 403 page', () => {
    useListMockWith403();
    useAuthenticatedUser();
    renderer();

    expect(singletonRouter).toMatchObject({ asPath: '/403' });
  });

  it('should show "No courses added yet." message', () => {
    useListMockWithNoExperiences();
    useAuthenticatedUser();

    const { getByText } = renderer();
    expect(getByText(/No courses added yet./i)).toBeInTheDocument();
  });
});

describe('List page server side', () => {
  it('context', () => {
    const context = { query: { listId: '1' } };
    const data = getServerSideProps(context);
    expect(data).toEqual({ props: { listId: '1' } });
  });
});
