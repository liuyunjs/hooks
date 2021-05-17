import React from 'react';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { useMemoize } from './useMemoize';
import { useForceUpdate } from './useForceUpdate';

export const useReactionRef = <S>(
  stateProps?: S | (() => S),
  level?: number,
) => {
  const ref = React.useRef<{ value: S }>();
  const forceUpdate = useForceUpdate();

  const maybeSetRef = (next: S | (() => S), callback?: () => void) => {
    const nextState = isFunction(next) ? next() : next;

    if (ref.current) {
      if (nextState !== ref.current.value) {
        ref.current.value = nextState;
        callback?.();
      }
    } else {
      ref.current = { value: nextState };
    }
  };

  useMemoize(
    () => {
      stateProps !== undefined && maybeSetRef(stateProps);
    },
    stateProps,
    level,
  );

  const setRef = React.useCallback((next: S | (() => S)) => {
    maybeSetRef(next, () => {
      forceUpdate();
    });
  }, []);

  return [ref.current!, setRef] as const;
};
