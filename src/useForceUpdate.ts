import React from 'react';

export const useForceUpdate = () => {
  const forceUpdate = React.useState([])[1];
  return React.useCallback(() => forceUpdate([]), []);
};
