import { useAuth } from '@/context/authContext';

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