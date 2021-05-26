import React from 'react';
import Animated, { useValue, timing } from 'react-native-reanimated';
import { TIMING_CONFIG } from './constant';
import { useAnimate_, AnimateBaseProps } from './useAnimate_';

export type TimingProps = AnimateBaseProps<Animated.TimingConfig>;

export const useTiming = ({
  position,
  config,
  onEnd,
  onStart,
  onUpdate,
}: TimingProps) => {
  return useAnimate_<Animated.TimingState, Animated.TimingConfig>({
    getState: React.useCallback(
      (position, finished, time, extraValue) => ({
        position,
        finished,
        time,
        frameTime: extraValue,
      }),
      [],
    ),
    config,
    extraValue: useValue<number>(0),
    position,
    defaultConfig: TIMING_CONFIG,
    onEnd,
    onStart,
    onUpdate,
    animate: timing,
  });
};
