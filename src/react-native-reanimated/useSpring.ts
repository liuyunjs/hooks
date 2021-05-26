import Animated, { spring } from 'react-native-reanimated';
import { SPRING_CONFIG } from './constant';

import { useAnimate_, AnimateBaseProps } from './useAnimate_';

export type SpringProps = AnimateBaseProps<Animated.SpringConfig> & {
  velocity: Animated.Value<number>;
};

export const useSpring = ({
  position,
  config,
  onEnd,
  onStart,
  velocity,
  onUpdate,
}: SpringProps) => {
  return useAnimate_<Animated.SpringState, Animated.SpringConfig>({
    config,
    defaultConfig: SPRING_CONFIG,
    extraValue: velocity,
    position,
    onStart,
    onEnd,
    animate: spring,
    onUpdate,
  });
};
