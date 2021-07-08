import React from 'react';
import { useValue } from 'react-native-reanimated';

export const useReactionValue = <T extends string | number | boolean>(
  valueInput: T,
) => {
  const value = useValue<T>(valueInput);

  React.useMemo(() => {
    value.setValue(valueInput);
  }, [valueInput]);

  return valueInput;
};
