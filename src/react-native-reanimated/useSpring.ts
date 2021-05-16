import Animated, { useValue, spring } from 'react-native-reanimated';
import { FALSE, TrueOrFalse, DEFAULT_HANDLE } from './constant';

import { useAnimate, AnimateBaseProps } from './useAnimate';

export type SpringProps = AnimateBaseProps<Animated.SpringConfig> & {
  velocity: Animated.Value<number>;
};

const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.01,
};

export const useSpring = ({
  position,
  config,
  onEnd = DEFAULT_HANDLE,
  onStart = DEFAULT_HANDLE,
  velocity,
}: SpringProps) => {
  const finished = useValue<TrueOrFalse>(FALSE);
  const time = useValue<number>(0);

  return useAnimate<Animated.SpringState, Animated.SpringConfig>({
    config,
    defaultConfig: SPRING_CONFIG,
    state: { position, velocity, finished, time },
    onStart,
    onEnd,
    animate: spring,
  });
};
