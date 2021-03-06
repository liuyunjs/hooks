import React from 'react';
import { isFunction } from '@liuyunjs/utils/lib/isFunction';
import { useConst } from './useConst';

export const useReactionRef = <S extends any>(input: S) => {
  const [ref, set] = React.useState<{ current: S }>({ current: input });

  React.useMemo(() => {
    if (input !== undefined) ref.current = input;
  }, [input]);

  const setState = useConst((next: S | ((prev: S) => S)) => {
    set((prev) => {
      const nextState = isFunction(next) ? next(prev.current) : next;
      if (nextState === prev.current) return prev;
      return { current: nextState };
    });
  });

  return [ref, setState] as const;
};
