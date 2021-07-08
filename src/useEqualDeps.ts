import React from 'react';
import { equal } from '@liuyunjs/utils/lib/equal';
import { isUndefined } from '@liuyunjs/utils/lib/isUndefined';

export const useEqualDeps = (deps: any, level?: number) => {
  const depsRef = React.useRef<{ value: any }>();

  const equaled =
    !!depsRef.current &&
    !isUndefined(deps) &&
    equal(depsRef.current.value, deps, level);
  depsRef.current = { value: deps };
  return equaled;
};
