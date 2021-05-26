import { Dimensions } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';

export const TRUE = 1;
export const FALSE = 0;
export const NOOP = 0;

export const DEFAULT_HANDLE = () => NOOP;

export const WIDTH = Dimensions.get('window').width;

export type TrueOrFalse = 0 | 1;

export const TIMING_CONFIG: Omit<Animated.TimingConfig, 'toValue'> = {
  duration: 300,
  easing: Easing.linear,
};

export const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.01,
};

export const DECAY_CONFIG: Animated.DecayConfig = {
  deceleration: 0.998,
};
