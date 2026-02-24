'use strict';

import '@testing-library/jest-dom'
import { act, fireEvent, render } from '@testing-library/react';
import { useUnauthenticatedUser } from '@/__mocks__/predefinedMocks';
import ShareButton from '@/components/buttons/ShareBtn';
import mock, { xAPISendStatement } from '@/utils/xapi/xAPISendStatement';

const mockXAPISendStatement = jest.fn();
describe('ShareButton', () => {
  jest.mock('@/utils/xapi/xAPISendStatement');

  it('should render correctly', () => {
    useUnauthenticatedUser();
    const screen = render(<ShareButton />);

    expect(screen.getByText('Share')).toBeEnabled();
  });
  it.skip('should call xAPISendStatement', async () => {
    mock.xAPISendStatement.mockImplementation(mockXAPISendStatement);
    useUnauthenticatedUser();
    const screen = render(<ShareButton />);
    await act(async () => {
      fireEvent.click(screen.getByText('Share'));
    });
    expect(mockXAPISendStatement).toHaveBeenCalled();
  });
});
