import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useForceUpdate } from '../src/useForceUpdate';

test('test useForceUpdate', () => {
  const { result } = renderHook(() => {
    const indexRef = React.useRef(0);
    const forceUpdate = useForceUpdate();

    indexRef.current++;

    return {
      forceUpdate,
      index: indexRef.current,
    };
  });

  expect(result.current.index).toBe(1);

  act(() => {
    result.current.forceUpdate();
  });

  expect(result.current.index).toBe(2);
});
