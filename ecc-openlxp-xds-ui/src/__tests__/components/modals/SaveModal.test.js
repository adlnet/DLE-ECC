'use strict';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateUserList } from '@/hooks/useCreateUserList';
import { useUpdateUserList } from '@/hooks/useUpdateUserList';
import { useUserOwnedLists } from '@/hooks/useUserOwnedLists.js';
import { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';
import SaveModal from '@/components/modals/SaveModal';
import userListData from '@/__mocks__/data/userLists.data';
import xAPIMapper from '@/utils/xapi/xAPIMapper';

jest.mock('@/hooks/useUpdateUserList', () => ({
  useUpdateUserList: jest.fn(),
}));

jest.mock('@/hooks/useCreateUserList', () => ({
  useCreateUserList: jest.fn(),
}));

jest.mock('@/hooks/useUserOwnedLists.js', () => ({
  useUserOwnedLists: jest.fn(),
}));

// mocking the useAuth hook
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const mutateFn = jest.fn();

const createMutateFn = jest.fn();

const renderer = (isAuth = false) => {
  // // defaults user to logged in
  if (!isAuth) {
    useAuth.mockReturnValue({
      user: null,
    });
  } else {
    useAuth.mockReturnValue({
      user: {
        user: {
          id: '1',
          username: 'test',
          email: '',
        },
      },
    });
  }

  return render(
    <QueryClientWrapper>
      <div>
        <SaveModal courseId={'12345'} title={"test"} modalState={true} />
      </div>
    </QueryClientWrapper>
  );
};

beforeEach(() => {
  useUpdateUserList.mockImplementation(() => ({
    mutate: mutateFn,
  }));

  useCreateUserList.mockImplementation(() => ({
    mutate: createMutateFn,
    isSuccess: true,
  }));

  useUserOwnedLists.mockImplementation(() => ({
    data: userListData,
    isSuccess: true,
  }));
});

describe('Save Modal', () => {
  describe('static content', () => {
    // it('should have a button id', () => {
    //   const { getByText } = renderer();
    //   act(() => {
    //     fireEvent.click(getByText(/save/i));
    //   });
    //   expect(getByText(/add "test" to lists/i).id).not.toBeNull();
    // });
    it('should render the title', () => {
      const { getByText } = renderer();
      act(() => {
        fireEvent.click(getByText(/save/i));
      });
      expect(getByText(/add "test" to lists/i)).toBeInTheDocument();
    });
  });
  describe('with list data', () => {
    it('should render the remove button', () => {
      const { getByText } = renderer();
      act(() => {
        fireEvent.click(getByText(/save/i));
      });

      expect(getByText(/remove/i)).toBeInTheDocument();
    });
    it('should render the add button', () => {
      const { getByText } = renderer();
      act(() => {
        fireEvent.click(getByText(/save/i));
      });

      expect(getByText(/add/i)).toBeInTheDocument();
    });

    it('should call mutate on click of remove', () => {
      const { getByText } = renderer();
      act(() => {
        fireEvent.click(getByText(/save/i));
      });

      act(() => {
        fireEvent.click(getByText(/remove/i));
      });

      expect(mutateFn).toHaveBeenCalled();
    });
    it('should call mutate on click of add', () => {
      const { getByText } = renderer();
      act(() => {
        fireEvent.click(getByText(/save/i));
      });

      act(() => {
        fireEvent.click(getByText(/add/i));
      });

      expect(mutateFn).toHaveBeenCalled();
    });
  });
  describe('create new list', () => {
    it.todo('should render input fields for name and description');
    it.todo('should');

    it.skip('should send xAPI statement when create is clicked', () => {
      const { getByText, getByPlaceholderText } = renderer(true);

      const spy = jest
        .spyOn(xAPISendStatement, 'xAPISendStatement')
        .mockImplementation(() => Promise.resolve({}));
      act(() => {
        fireEvent.click(getByText(/save/i));
      });

      fireEvent.change(getByPlaceholderText(/name/i), {
        target: { value: 'Name' },
      });

      fireEvent.change(getByPlaceholderText(/List Description.../i), {
        target: { value: 'Descprition' },
      });

      act(() => {
        fireEvent.click(getByText(/create/i));
      });

      expect(spy).toHaveBeenCalled();
    });
  });
});
