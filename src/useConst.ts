import React from 'react';

export const useConst = <T>(input: T) => {
  return React.useRef(input).current;
};
