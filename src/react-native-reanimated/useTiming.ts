import Animated, { useValue, timing } from 'react-native-reanimated';
import { Easing } from 'react-native-reanimated';
import { FALSE, TrueOrFalse } from './constant';
import { useAnimate, AnimateBaseProps } from './useAnimate';

export type TimingProps = AnimateBaseProps<Animated.TimingConfig>;

const TIMING_CONFIG: Omit<Animated.TimingConfig, 'toValue'> = {
  duration: 300,
  easing: Easing.linear,
};

export const useTiming = ({
  position,
  config,
  onEnd,
  onStart,
}: TimingProps) => {
  const finished = useValue<TrueOrFalse>(FALSE);
  const time = useValue<number>(0);
  const frameTime = useValue<number>(0);

  return useAnimate<Animated.TimingState, Animated.TimingConfig>({
    state: { finished, frameTime, time, position },
    config,
    defaultConfig: TIMING_CONFIG,
    onEnd,
    onStart,
    animate: timing,
  });
};
