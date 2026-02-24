'use strict';

import { act, renderHook } from '@testing-library/react-hooks';
import useTimeout from '../../hooks/useTimeout';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
describe('useTimeout', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should default to false', () => {
    const { result } = renderHook(() => useTimeout(1000));

    expect(result.current.state).toBeFalsy();
  });
  it('should show for 1s', () => {
    const { result } = renderHook(() => useTimeout(1000));
    act(() => {
      result.current.show();
    });

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
  });
  it('should show for 1s before returning to false', () => {
    const { result } = renderHook(() => useTimeout(1000));
    act(() => {
      result.current.show();
    });
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(result.current.state).toBeFalsy();
  });
});
