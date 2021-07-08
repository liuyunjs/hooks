import React from 'react';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { useMemoize } from './useMemoize';
import { useConst } from './useConst';

export const useDeepReactionRef = <S extends any>(
  input?: S | (() => S),
  level?: number,
) => {
  const [ref, set] = React.useState<{ current: S }>({ current: undefined });

  useMemoize(
    () => {
      input !== undefined &&
        (ref.current = isFunction(input) ? input() : input);
    },
    input,
    level,
  );

  const setState = useConst((next: S | ((prev: S) => S)) => {
    set((prev) => {
      const nextState = isFunction(next) ? next(prev.current) : next;
      if (nextState === prev.current) return prev;
      return { current: nextState };
    });
  });

  return [ref, setState] as const;
};
