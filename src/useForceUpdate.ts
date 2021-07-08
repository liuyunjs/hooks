import React from 'react';
import { useConst } from './useConst';

export const useForceUpdate = () => {
  const forceUpdate = React.useState([])[1];
  return useConst(() => forceUpdate([]));
};
