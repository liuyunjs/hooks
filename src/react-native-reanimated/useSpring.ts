import React from 'react';
import Animated, { spring } from 'react-native-reanimated';
import { SPRING_CONFIG } from './constant';
import { animateHookFactory, AnimateProps } from './animateHookFactory';

export type SpringProps = AnimateProps<
  Animated.SpringState,
  Animated.SpringConfig,
  { toValue: Animated.Adaptable<number> }
>;

export const useSpring = animateHookFactory<
  Animated.SpringState,
  Animated.SpringConfig,
  { toValue: Animated.Adaptable<number> }
>(
  spring,
  function useSpringConf({
    stiffness,
    damping,
    mass,
    overshootClamping,
    restDisplacementThreshold,
    restSpeedThreshold,
    position,
    finished,
    time,
    velocity,
    toValue,
  }) {
    const state = React.useMemo(
      () => ({ position, finished, time, velocity }),
      [position, finished, time, velocity],
    );
    const config = React.useMemo(
      () => ({
        toValue,
        stiffness: stiffness ?? SPRING_CONFIG.stiffness,
        damping: damping ?? SPRING_CONFIG.damping,
        mass: mass ?? SPRING_CONFIG.mass,
        overshootClamping: overshootClamping ?? SPRING_CONFIG.overshootClamping,
        restDisplacementThreshold:
          restDisplacementThreshold ?? SPRING_CONFIG.restDisplacementThreshold,
        restSpeedThreshold:
          restSpeedThreshold ?? SPRING_CONFIG.restSpeedThreshold,
      }),
      [
        stiffness,
        damping,
        mass,
        overshootClamping,
        restDisplacementThreshold,
        restSpeedThreshold,
        toValue,
      ],
    );

    return [state, config] as const;
  },
);
