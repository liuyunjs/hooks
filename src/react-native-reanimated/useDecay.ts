import Animated, { decay } from 'react-native-reanimated';
import { DECAY_CONFIG } from './constant';

import { useAnimate_, AnimateBaseProps } from './useAnimate_';

export type DecayProps = AnimateBaseProps<Animated.DecayConfig> & {
  velocity: Animated.Value<number>;
};

export const useDecay = ({
  position,
  config,
  onEnd,
  onStart,
  velocity,
  onUpdate,
}: DecayProps) => {
  return useAnimate_<Animated.DecayState, Animated.DecayConfig>({
    config,
    extraValue: velocity,
    position,
    defaultConfig: DECAY_CONFIG,
    onStart,
    onEnd,
    animate: decay,
    onUpdate,
  });
};
