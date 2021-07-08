import Animated, { decay } from 'react-native-reanimated';
import { DECAY_CONFIG } from './constant';

import { AnimateProps, animateHookFactory } from './animateHookFactory';
import React from 'react';

export type DecayProps = AnimateProps<
  Animated.DecayState,
  Animated.DecayConfig,
  {}
>;

export const useDecay = animateHookFactory<
  Animated.DecayState,
  Animated.DecayConfig,
  {}
>(
  decay,
  function useDecayConf({ position, finished, time, velocity, deceleration }) {
    const state = React.useMemo(
      () => ({ position, finished, time, velocity }),
      [position, finished, time, velocity],
    );
    const config = React.useMemo(
      () => ({ deceleration: deceleration ?? DECAY_CONFIG.deceleration }),
      [deceleration],
    );

    return [state, config] as const;
  },
);
