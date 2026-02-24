'use strict';

// import { MemoryRouterProvider } from 'next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider-11.1';
import '@testing-library/jest-dom';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  updateListMockFn,
  useAuthenticatedUser,
  useMockConfig,
  useMockUpdateUserList,
  useMockUserList,
  useMockUserListWith401,
  useMockUserListWith403,
  useMockUserListWithDifferentUserId,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import EditList, { getServerSideProps } from '@/pages/lists/edit/[listId]';
import MockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

beforeEach(() => {
  useMockConfig();
});

const renderer = () => {
  MockRouter.setCurrentUrl('/lists/edit/1');
  return render(
    <MemoryRouterProvider>
      <QueryClientWrapper>
        <EditList listId={1} />
      </QueryClientWrapper>
    </MemoryRouterProvider>
  );
};

describe('Edit List', () => {
  it('should render the page', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    screen.getByText('View public list');
  });

  it('should navigate the user to "/" if not authenticated', () => {
    useUnauthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/' });
  });

  it('should navigate the user to "/" if the user id does not match the list owner id', () => {
    useAuthenticatedUser();
    useMockUserListWithDifferentUserId();
    useMockUpdateUserList();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/lists/1' });
  });

  it('should navigate the user to "/401" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockUserListWith401();
    useMockUpdateUserList();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/401' });
  });

  it('should navigate the user to "/403" if the user is not the owner of the list', () => {
    useAuthenticatedUser();
    useMockUserListWith403();
    useMockUpdateUserList();
    renderer();
    expect(singletonRouter).toMatchObject({ asPath: '/403' });
  });

  it('should navigate user to the public view of the list on click', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    act(() => {
      fireEvent.click(screen.getByText('View public list'));
    });
    expect(singletonRouter).toMatchObject({ asPath: '/lists/1' });
  });

  it('should navigate user to the course page on click', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    act(() => {
      fireEvent.click(screen.getByText('Test Title'));
    });
    expect(singletonRouter).toMatchObject({ asPath: '/course/1' });
  });

  it('should load the list data', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getByText('test description')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should remove a course when "remove" is clicked', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    });
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(updateListMockFn).toHaveBeenCalled();
  });

  it('should call the updateList mutation when the form is submitted', () => {
    useAuthenticatedUser();
    useMockUserList();
    useMockUpdateUserList();
    renderer();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(updateListMockFn).toHaveBeenCalled();
  });
});

describe('List page server side', () => {
  it('context', () => {
    const context = { query: { listId: '1' } };
    const data = getServerSideProps(context);
    expect(data).toEqual({ props: { listId: '1' } });
  });
});
