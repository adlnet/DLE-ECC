'use strict';

// noinspection JSCheckFunctionSignatures

import { act, fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/menus/UserMenu';
import singletonRouter from 'next/router';

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('next/router', () => require('next-router-mock'));
describe('User Menu', () => {
  describe('with user', () => {
    beforeEach(() => {
      useAuth.mockImplementation(() => ({
        user: { user: { first_name: 'value' } },
      }));
      render(<UserMenu />);
    });
    it('shows the users email', () => {
      expect(screen.getByText('value')).toBeInTheDocument();
    });
    it('shows user menu', () => {
      const button = screen.getByText(/value/i);

      act(() => {
        fireEvent.click(button);
      });

      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });
    it('shows list options', () => {
      const button = screen.getByText(/value/i);

      fireEvent.click(button);

      expect(screen.getByText(/My Lists/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText(/My Lists/i));
      expect(singletonRouter).toMatchObject({
        asPath: '/lists/owned',
      });
      
      fireEvent.click(button);
      expect(screen.getByText(/Subscribed/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText(/Subscribed/i));
      expect(singletonRouter).toMatchObject({
        asPath: '/lists/subscribed',
      });

      fireEvent.click(button);
      expect(screen.getByText(/Saved Search/i)).toBeInTheDocument();
      fireEvent.click(screen.getByText(/Saved Search/i));
      expect(singletonRouter).toMatchObject({
        asPath: '/lists/savedSearches',
      });

      // expect(screen.getByText(/Search Courses/i)).toBeInTheDocument();
      // fireEvent.click(screen.getByText(/Search Courses/i));
      // expect(singletonRouter).toMatchObject({
      //   asPath: '/',
      // });

      // expect(screen.getByText(/Search Lists/i)).toBeInTheDocument();
      // fireEvent.click(screen.getByText(/Search Lists/i));
      // expect(singletonRouter).toMatchObject({
      //   asPath: '/lists/searchLists',
      // });
    });

    it('applies the correct styling', () => {
      const button = screen.getByText(/value/i);

      fireEvent.click(button);

      // hover over the button
      const menuOption = screen.getByText(/My Lists/i);
      expect(menuOption.className.includes('bg-white')).toBeTruthy();

      fireEvent.focus(menuOption);
      expect(menuOption.className.includes('bg-gray-100')).toBeTruthy();
    });

    it('applies the correct styling when focused', () => {
      const button = screen.getByText(/value/i);

      fireEvent.click(button);

      // hover over the button
      const menuOption = screen.getByText(/Logout/i);
      expect(
        menuOption.className.includes('ring-2 ring-blue-500 ring-offset-1')
      ).toBeFalsy();
      fireEvent.focus(menuOption);
      expect(menuOption.className.includes('ring-2 ring-blue-500 ring-offset-1')).toBeTruthy();
    });
  });
});
