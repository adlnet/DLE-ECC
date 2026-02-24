'use strict';

import { act, fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom'
import SelectList from '@/components/inputs/SelectList';
import aggregationsData from '@/__mocks__/data/aggregations.data';

describe('Select List', () => {
  beforeEach(() => {
    console.log = jest.fn();
    let params = {};
    const keys = Object.keys(aggregationsData);
    const local = aggregationsData[keys[0]];
    render(
      <SelectList
        initialValue={params[local.field_name]}
        options={local}
        keyName={keys[0]}
        onChange={() => console.log('tada')}
        onClear={() => console.log('cleared')}
      />
    );
  });

  it('should show default name', () => {
    expect(screen.getByText('Course Type')).toBeInTheDocument();
  });

  it('should show clear button', () => {
    expect(screen.getByText('clear')).toBeInTheDocument();
  });

  it('should execute passed fn on clear', () => {
    act(() => {
      const clearBTN = screen.getByText('clear');
      fireEvent.click(clearBTN);
    });

    expect(console.log).toHaveBeenCalledWith('cleared');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should show menu items on click', () => {
    act(() => {
      const button = screen.getByText('Course Type');
      fireEvent.click(button);
    });

    expect(screen.getByText('test bucket 1')).toBeInTheDocument();
    expect(screen.getByText('test bucket 2')).toBeInTheDocument();
  });

  it('should show selected value as the button title', () => {
    act(() => {
      const button = screen.getByText('Course Type');
      fireEvent.click(button);
    });

    act(() => {
      const selection = screen.getByText('test bucket 1');
      fireEvent.click(selection);
    });

    expect(screen.getAllByText('test bucket 1').length).toBe(1);
  });

  it('should execute passed fn on change', () => {
    act(() => {
      const button = screen.getByText('Course Type');
      fireEvent.click(button);
    });

    act(() => {
      const selection = screen.getByText('test bucket 1');
      fireEvent.click(selection);
    });

    expect(console.log).toHaveBeenCalledWith('tada');
    expect(console.log).toHaveBeenCalledTimes(1);
  } );
  

  it('should execute passed fn on change', () => {
    act(() => {
      const button = screen.getByText('Course Type');
      fireEvent.click(button);
    });

    act(() => {
      const selection = screen.getByText('test bucket 1');
      fireEvent.focus(selection);
    });
    expect(screen.getByText('test bucket 1').className.includes('bg-gray-50')).toBeTruthy()
  });
});
