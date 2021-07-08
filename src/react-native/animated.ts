import React from 'react';
import { Animated } from 'react-native';
import useWillMount from 'react-will-mount-hook';

export const useValue = (value: number) => {
  return useWillMount(() => new Animated.Value(value));
};

export const useValueXY = (x: number, y: number = x) => {
  return useWillMount(() => new Animated.ValueXY({ x, y }));
};

export const useReactionValue = (valueInput: number) => {
  const value = useValue(valueInput);

  React.useMemo(() => {
    value.setValue(valueInput);
  }, [valueInput]);

  return valueInput;
};
