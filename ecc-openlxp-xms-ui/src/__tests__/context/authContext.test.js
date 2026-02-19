'use strict';

import { AuthContext, AuthProvider } from '../../context/authContext';
import { render } from '@testing-library/react';
import { useAuthenticatedUser } from '@/__mocks__/predefinedMocks';
import MockAxios from 'jest-mock-axios';
import mockRouter from 'next-router-mock';

jest.unmock('../../context/authContext');

// mock axios
jest.mock('axios');

// mock axios
// jest.mock('axios');
// MockAxios.get.mockImplementation(() => Promise.resolve({ data: { experiences: [{}] } }));
// MockAxios.post.mockImplementation(() => Promise.resolve({ data: { experiences: [{}] } }));
// beforeEach(() => {
//   useAuthenticatedUser();
//   mockRouter.setCurrentUrl('/');
// });

describe('Auth Context', () => {
  it('does render', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>
          <p>Hello</p>
        </div>
      </AuthProvider>
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('user is null', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            return <div>{JSON.stringify(context.user)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });

  it('error is null', () => {
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            return <div>{JSON.stringify(context.error)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });

  it('does login', () => {
    MockAxios.post.mockImplementation(() => Promise.resolve({ data: { experiences: [{}] } }));
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            context.login('hi');
            return <div>{JSON.stringify(context.error)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });

  it('does register', () => {
    MockAxios.post.mockImplementation(() => Promise.resolve({}));
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            context.register('hi');
            return <div>{JSON.stringify(context.error)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });

  it('fail register', () => {
    MockAxios.post.mockImplementation(() => Promise.reject(new Error("register fail")));
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            context.register('hi');
            return <div>{JSON.stringify(context.user)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });

  it('does logout', () => {
    MockAxios.post.mockImplementation(() => Promise.resolve({}));
    const { getByText } = render(
      <AuthProvider>
        <AuthContext>
          {(context) => {
            expect(context).toBeTruthy();
            context.logout();
            return <div>{JSON.stringify(context.error)}</div>;
          }}
        </AuthContext>
      </AuthProvider>
    );
    expect(getByText('null')).toBeInTheDocument();
  });
});
