'use strict';

import '@testing-library/jest-dom'
import { QueryClientWrapper } from '@/__mocks__/queryClientMock.js';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import Home from '@/pages/index';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import xAPIMapper from "@/utils/xapi/xAPIMapper";

jest.mock('next/dist/client/router', () => require('next-router-mock'));

// mock auth
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('should render the title', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/');

    useAuth.mockImplementation(() =>  {
      return {
        user: { user: {email: 'test@email.com'}},
      };
    });

    render(
      <QueryClientWrapper>
        <Home />
      </QueryClientWrapper>
    );
  });

  it('should render the title, search bar and button', () => {
    expect(screen.getByText(`Enterprise Course Catalog`)).toBeInTheDocument();
    expect(screen.getByText(`Department of Defense`)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(`Search the catalog`)
    ).toBeInTheDocument();
  });

  it('should not navigate away if no field.keyword or empty keyword', () => {
    act(() => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTitle(/search/i));
    });

    expect(screen.getByRole('textbox', { id: /search-bar/i }).value).toBe('');
  });

  it('should update the value of the search bar', () => {
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Search the catalog'), {
        target: { value: 'updated value' },
      });
    });

    expect(screen.getByPlaceholderText('Search the catalog').value).toBe(
      'updated value'
    );

    act(() => {
      fireEvent.click(screen.getByTitle(/search/i));
    });
    expect(singletonRouter).toMatchObject({
      asPath: '/search?keyword=updated+value&p=1',
    });
  });

  it('should send xAPI Statement', () => {

    const spy = jest.spyOn(xAPIMapper, 'sendStatement')
    .mockImplementation(() => Promise.resolve({})
    );

    act(() => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'data' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTitle(/search/i));
    });

    expect(spy).toHaveBeenCalled();

  });
});
