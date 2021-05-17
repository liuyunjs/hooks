import React from 'react';
import { equal } from '@liuyunjs/utils/lib/equal';
import { isUndefined } from '@liuyunjs/utils/lib/isUndefined';

export const useEqualDeps = (deps: any, level?: number) => {
  const depsRef = React.useRef<{ value: any }>();

  if (
    !depsRef.current ||
    isUndefined(deps) ||
    !equal(depsRef.current.value, deps, level)
  ) {
    depsRef.current = { value: deps };

    return false;
  }

  depsRef.current = { value: deps };
  return true;
};
