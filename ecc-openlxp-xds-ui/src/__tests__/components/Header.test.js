'use strict';

import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import mockRouter from 'next-router-mock';

//mocks
jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
beforeEach(() => {
  mockRouter.setCurrentUrl('/');
});

// This is all you need:
describe('Header', () => {
  describe('without user', () => {
    useAuth.mockImplementation(() => ({
      user: null,
    }));
    it('shows sign in', () => {
      const { getByText } = render(<Header />);
      expect(getByText(/sign in/i));
    });
    it('shows sign up', () => {
      const { getByText } = render(<Header />);
      expect(getByText(/sign up/i));
    });
    it('shows home navigator', () => {
      const { getByTitle } = render(<Header />);
      expect(getByTitle(/home/i)).toBeInTheDocument();
    });
  });
  describe('with user', () => {
    it('shows user menu button', () => {
      useAuth.mockImplementation(() => {
        return {
          user: { user: { first_name: 'Test' } },
        };
      });

      const { getByText } = render(<Header />);

      expect(getByText('Test')).toBeInTheDocument();
    });
  });
});
