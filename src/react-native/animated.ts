import { Animated } from 'react-native';
import useWillMount from 'react-will-mount-hook';

export const useValue = (value: number) => {
  return useWillMount(() => new Animated.Value(value));
};

export const useValueXY = (x: number, y: number = x) => {
  return useWillMount(() => new Animated.ValueXY({ x, y }));
};
