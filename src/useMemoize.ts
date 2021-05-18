import React from 'react';
import { useEqualDeps } from './useEqualDeps';

export const useMemoize = <T extends (...args: any[]) => any>(
  factory: T,
  deps?: any,
  level?: number,
) => {
  const equaled = useEqualDeps(deps, level);
  const resultRef = React.useRef<ReturnType<T>>();
  if (!equaled) resultRef.current = factory();
  return resultRef.current!;
};
