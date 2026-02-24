'use strict';

const { renderHook, act } = require('@testing-library/react-hooks');
import { useSearchUrl } from '../../hooks/useSearchUrl';

jest.unmock('@/hooks/useSearchUrl');

describe('useUrl', () => {
  it('creates query string from an object', () => {
    const { result } = renderHook(() => useSearchUrl({ test: 'value' }));
    act(() => {});

    // no localhost is provided during the mock
    expect(result.current.url.includes('/es-api/?test=value')).toBeTruthy();
  });

  it('updates value from a new object', () => {
    const { result } = renderHook(() => useSearchUrl({ test: 'test' }));

    act(() => {
      result.current.setUrl({ test: 'updated' });
    });

    expect(result.current.url.includes('/es-api/?test=updated')).toBeTruthy();
  });
});
