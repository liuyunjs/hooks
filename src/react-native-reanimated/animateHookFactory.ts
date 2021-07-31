import React from 'react';
import Animated, {
  clockRunning,
  useValue,
  cond,
  set,
  block,
  startClock,
  stopClock,
} from 'react-native-reanimated';
import { FALSE, TrueOrFalse, DEFAULT_HANDLE, NOOP } from './constant';
import { useClock } from './useClock';
import { useConst } from '../useConst';
import { useSwitch } from './useSwitch';

type AnimateCallbacks<State> = {
  onStart?: (state: State) => Animated.Adaptable<any>;
  onEnd?: (state: State) => Animated.Adaptable<any>;
  onUpdate?: (state: State) => Animated.Adaptable<any>;
};

export type AnimateProps<
  State extends Animated.AnimationState,
  Config extends {},
  Extra = {},
> = AnimateCallbacks<State> &
  Omit<State, 'finished' | 'time'> &
  Partial<Omit<Config, 'toValue'>> &
  Extra;

export const animateHookFactory = <
  State extends Animated.AnimationState,
  Config extends {},
  Extra = {},
>(
  animate: (
    clock: Animated.Clock,
    state: State,
    config: Config,
  ) => Animated.Node<number>,
  useAnimConf: (
    props: AnimateProps<State, Config, Extra> & {
      finished: Animated.Value<number>;
      time: Animated.Value<number>;
    },
  ) => readonly [State, Config],
) => {
  return function useAnimate(props: AnimateProps<State, Config, Extra>) {
    const {
      onEnd = DEFAULT_HANDLE,
      onStart = DEFAULT_HANDLE,
      onUpdate = DEFAULT_HANDLE,
    } = props;

    const clock = useClock();
    const finished = useValue<TrueOrFalse>(FALSE);
    const time = useValue<number>(0);

    const [state, config] = useAnimConf(
      Object.assign({}, props, { finished, time }),
    );

    const exec = useSwitch({
      onTrueAlways: React.useCallback(() => {
        return block([
          cond(
            clockRunning(clock),
            NOOP,
            'frameTime' in state
              ? //  @ts-ignore
                [set(time, 0), set(state.frameTime, 0)]
              : set(time, 0),
          ),
          animate(clock, state, config),
          cond(clockRunning(clock), onUpdate(state), [
            set(finished, FALSE),
            onStart(state),
            startClock(clock),
          ]),
          cond(finished, [exec.close(), stopClock(clock)]),
        ]);
      }, [onStart, onUpdate]),
      onFalseAlways: useConst(() => stopClock(clock)),
      onFalse: React.useCallback(() => onEnd(state), [onEnd]),
    });

    return {
      start: exec.open,
      stop: exec.close,
      attach: exec.attach,
      detach: exec.detach,
    };
  };
};
