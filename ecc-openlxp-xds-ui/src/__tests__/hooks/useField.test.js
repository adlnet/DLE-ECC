'use strict';

import { act, renderHook } from '@testing-library/react-hooks';
import useField from '../../hooks/useField';

describe('useField', () => {
  it('loads the initial value', () => {
    const { result } = renderHook(() => useField({ test: 'test' }));

    act(() => {});

    expect(result.current.fields).toEqual({ test: 'test' });
  });

  it('updates the specified value', () => {
    const { result } = renderHook(() => useField({ test: 'test' }));

    act(() => {
      result.current.updateKeyValuePair('test', 'updated');
    });

    expect(result.current.fields).toEqual({ test: 'updated' });
  });

  it('resets the specified value', () => {
    const { result } = renderHook(() => useField({ test: 'field' }));

    act(() => {
      result.current.resetKey('test');
    });

    expect(result.current.fields).toEqual({ test: '' });
  });
});
