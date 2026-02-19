'use strict';

import { MemoryRouter, Route } from "react-router-dom";
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useAuthenticatedUser, useUnauthenticatedUser } from '@/__mocks__/predefinedMocks';

import { unmountComponentAtNode } from "react-dom";
import React from 'react';
import Register from '../../pages/register';
import mockAxios from 'jest-mock-axios';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';

let container = null;

  beforeEach(() => {
    useUnauthenticatedUser();
    container = document.createElement("div");
    document.body.appendChild(container);
    mockRouter.setCurrentUrl('/');
  });
  
  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });
  


  const renderer = () => {
    return render(
        <Register />,
        container
    );
  };

describe('Register Page', () => {
    it('should render a form', () => {
        renderer();
  
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(
          screen.getByPlaceholderText('Confirm Password')
        ).toBeInTheDocument();
  
        expect(
          screen.getByRole('button', { name: /Create Account/i })
        ).toBeInTheDocument();
    });
});

describe('Register Page', () => {
  describe('Actions', () => {
    beforeEach(() => {
        renderer();
    });

    it('should change values on input: Email', () => {
      const input = screen.getByPlaceholderText('Email');

      act(() => {
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John?' } });
        fireEvent.keyPress(screen.getByPlaceholderText('First Name'), { key: '?' });
      });

      act(() => {
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.keyPress(screen.getByPlaceholderText('First Name'), { key: '/' });
      });

      act(() => {
        fireEvent.change(input, { target: { value: 'email' } });
      });

      const button = screen.getByText(/Create Account/i);
      fireEvent(button, new MouseEvent("click", { bubbles: true }));
      expect(input.value).toBe('email');
    });

    it('should change values on input: Password', () => {
      const input = screen.getByPlaceholderText('Password');
      act(() => {
        fireEvent.change(input, { target: { value: 'password' } });
      });

      expect(input.value).toBe('password');
    });

    it('should register a user', () => {
      mockAxios.post.mockImplementation(() =>
        Promise.resolve({ data: { user: {} } })
      );

      act(() => {
        const fname = screen.getByPlaceholderText('First Name');
        const lname = screen.getByPlaceholderText('Last Name');
        const email = screen.getByPlaceholderText('Email');
        const password = screen.getByPlaceholderText('Password');
        const confirmPassword = screen.getByPlaceholderText('Confirm Password');

        fireEvent.change(fname, { target: { value: 'Test' } });
        fireEvent.change(lname, { target: { value: 'Test' } });
        fireEvent.change(email, { target: { value: 'email@test.com' } });
        fireEvent.change(password, { target: { value: 'password' } });
        fireEvent.change(confirmPassword, { target: { value: 'password' } });
      });
    });
  });

  describe('Navigate to other pages', () => {
    it('should click login button and navigate to login page', () => {
      let testLocation;
      act(() => {
        render(
          <MemoryRouter initialEntries={["/register"]}>
            <Register />
            <Route
              path="/login"
              render={({ location }) => {
                testLocation = location;
              }}
            />
          </MemoryRouter>,
          container
        );
        const button = screen.getByText(/Sign in to your Account/i);
        fireEvent(button, new MouseEvent("click", { bubbles: true }));
      });
      expect(singletonRouter).toMatchObject({
        asPath: '/login',
      });

    });

    it('if user, navigate to dashboard', () => {
      let useAuth = jest.fn();
      useAuth.mockImplementation(() => ({
        user: { 
          user: {
            id: '1',
            first_name: 'Test',
            last_name: 'User',
            email: 'test@test.com',
        }},
      }));
      act(() => {
        render(
          <MemoryRouter initialEntries={["/register"]}>
            <Register />
            <Route
              path="/dashboard"
              render={() => { }}
            />
          </MemoryRouter>,
          container
        );
        
      });
    });
  });
});
