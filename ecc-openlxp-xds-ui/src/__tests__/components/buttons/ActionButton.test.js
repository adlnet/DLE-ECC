'use strict';

import { act, fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import ActionButton from '../../../components/buttons/ActionButton';

describe('Action Button', () => {
  it('shows the child components', () => {
    const { getByText } = render(<ActionButton>Test</ActionButton>);
    expect(getByText(/test/i)).toBeInTheDocument();
  });
  it('calls the passed function passed', () => {
    console.log = jest.fn();
    const { getByText } = render(
      <ActionButton
        onClick={() => {
          console.log('test');
        }}
      >
        Test
      </ActionButton>
    );
    act(() => {
      const button = getByText(/test/i);
      fireEvent.click(button);
    });
    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('test');
  });
});
