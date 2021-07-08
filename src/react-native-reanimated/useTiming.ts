import React from 'react';
import Animated, { timing, useValue } from 'react-native-reanimated';
import { TIMING_CONFIG } from './constant';
import { animateHookFactory, AnimateProps } from './animateHookFactory';

export type TimingProps = AnimateProps<
  Omit<Animated.TimingState, 'frameTime'>,
  Animated.TimingConfig,
  { toValue: Animated.Adaptable<number> }
>;

export const useTiming = animateHookFactory<
  Omit<Animated.TimingState, 'frameTime'>,
  Animated.TimingConfig,
  { toValue: Animated.Adaptable<number> }
>(
  timing,
  function useTimingConf({
    duration,
    easing,
    toValue,
    position,
    time,
    finished,
  }) {
    const frameTime = useValue<number>(0);
    const state = React.useMemo(
      () => ({ position, finished, time, frameTime }),
      [position, finished, time, frameTime],
    );

    const config = React.useMemo(
      () => ({
        toValue,
        duration: duration ?? TIMING_CONFIG.duration,
        easing: easing ?? TIMING_CONFIG.easing,
      }),
      [toValue, easing, duration],
    );

    return [state, config] as const;
  },
);
