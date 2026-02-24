'use strict';

import '@testing-library/jest-dom'
import { QueryClientWrapper } from '@/__mocks__/queryClientMock';
import { act } from 'react-dom/test-utils';
import {
  createSaveSearchMockFn,
  useAuthenticatedUser,
  useMockCreateSaveSearch,
  useUnauthenticatedUser,
} from '@/__mocks__/predefinedMocks';
import { fireEvent, render } from '@testing-library/react';
import { useCreateSaveSearch } from '@/hooks/useCreateSaveSearch';
import CreateSavedSearchModal from '@/components/modals/CreateSavedSearch';

const renderer = () => {
  return render(
    <QueryClientWrapper>
      <CreateSavedSearchModal path={'/path'} />
    </QueryClientWrapper>
  );
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('CreateSavedSearchModal', () => {
  it('should render the button', () => {
    useAuthenticatedUser();
    useMockCreateSaveSearch();
    const { getByText } = renderer();
    expect(getByText('Save this search')).toBeInTheDocument();
  });

  it('should open a modal for creating a saved search when the button is clicked', () => {
    useAuthenticatedUser();
    useMockCreateSaveSearch();
    const { getByText, getByPlaceholderText } = renderer();
    act(() => {
      fireEvent.click(getByText('Save this search'));
    });
    expect(getByPlaceholderText('Query Name')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
  });

  it('should call the api when save is clicked', () => {
    useAuthenticatedUser();
    useMockCreateSaveSearch();
    const { getByText, getByPlaceholderText } = renderer();
    act(() => {
      fireEvent.click(getByText('Save this search'));
    });
    act(() => {
      fireEvent.change(getByPlaceholderText('Query Name'), {
        target: { value: 'test' },
      });
    });
    act(() => {
      fireEvent.click(getByText('Save'));
    });
    expect(createSaveSearchMockFn).toHaveBeenCalled();
  });

  it('should not call the api when there is no query to save', () => {
    useAuthenticatedUser();
    useMockCreateSaveSearch();
    const { getByText, getByPlaceholderText } = renderer();
    act(() => {
      fireEvent.click(getByText('Save this search'));
    });
    act(() => {
      fireEvent.click(getByText('Save'));
    });
    expect(createSaveSearchMockFn).not.toHaveBeenCalled();
  });
});

// describe('Save this search', () => {
//   it('should show the button.', () => {
//     const { getByText } = renderer();
//     expect(getByText(/save this search/i)).toBeInTheDocument();
//   });
//   it('should show modal on click', () => {
//     const { getByText } = renderer();

//     act(() => {
//       const button = getByText(/save this search/i);
//       fireEvent.click(button);
//     });

//     expect(getByText('Save')).toBeInTheDocument();
//   });
//   it('should change value when typed', () => {
//     const { getByText, getByPlaceholderText } = renderer();

//     act(() => {
//       const button = getByText(/save this search/i);
//       fireEvent.click(button);
//     });

//     const input = getByPlaceholderText(/query name/i);
//     act(() => {
//       fireEvent.change(input, { target: { value: 'test' } });
//     });

//     expect(input.value).toBe('test');
//   });
//   it('should call useCreateSaveSearch', () => {
//     const { getByText, getByPlaceholderText } = renderer();

//     act(() => {
//       const button = getByText(/save this search/i);
//       fireEvent.click(button);
//     });

//     const input = getByPlaceholderText(/query name/i);
//     act(() => {
//       fireEvent.change(input, { target: { value: 'test' } });
//     });

//     act(() => {
//       fireEvent.click(getByText('Save'));
//     });
//     expect(mutateFn).toHaveBeenCalled();
//   });
//   it('should not call useCreateSaveSearch', () => {
//     const { getByText, getByPlaceholderText } = renderer();

//     act(() => {
//       const button = getByText(/save this search/i);
//       fireEvent.click(button);
//     });

//     const input = getByPlaceholderText(/query name/i);
//     act(() => {
//       fireEvent.change(input, { target: { value: '' } });
//     });

//     act(() => {
//       fireEvent.click(getByText('Save'));
//     });
//     expect(mutateFn).not.toHaveBeenCalled();
//   });
// });
