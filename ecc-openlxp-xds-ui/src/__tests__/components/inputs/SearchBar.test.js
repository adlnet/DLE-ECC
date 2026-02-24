'use strict';

import { act, fireEvent, render, screen } from '@testing-library/react';
import SearchBar from '../../../components/inputs/SearchBar';

describe('SearchBar', () => {
  it('should set the value of input to the keyword prop', () => {
    render(<SearchBar parameters={{ keyword: '' }} onChange={() => {}} />);

    expect(screen.getByPlaceholderText('Search the catalog').value).toBe('');
  });

  it('should execute on click fn', () => {
    console.log = jest.fn();

    render(
      <SearchBar
        parameters={{ keyword: 'test' }}
        onClick={() => console.log('tada')}
        onChange={() => {}}
      />
    );

    act(() => {
      fireEvent.click(screen.getByTitle('Search'));
    });

    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should execute on click, on enter', () => {
    console.log = jest.fn();

    render(
      <SearchBar
        parameters={{ keyword: 'test' }}
        onClick={() => console.log('tada')}
        onChange={() => {}}
      />
    );

    act(() => {
      fireEvent.keyPress(screen.getByPlaceholderText('Search the catalog'), {
        charCode: '13',
      });
      fireEvent.submit(screen.getByPlaceholderText('Search the catalog'));
    });
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should not execute on click, on any other key', () => {
    render(
      <SearchBar
        parameters={{ keyword: 'test' }}
        onClick={() => console.log('tada')}
        onChange={() => {}}
      />
    );

    act(() => {
      fireEvent.keyPress(screen.getByPlaceholderText('Search the catalog'), {});
    });
  });

  it('should execute reset fn', () => {
    console.log = jest.fn();

    render(
      <SearchBar
        parameters={{ keyword: 'test' }}
        onReset={() => console.log('tada')}
        onChange={() => {}}
      />
    );

    act(() => {
      fireEvent.click(screen.getByTitle('reset'));
    });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('tada');
  });
});
