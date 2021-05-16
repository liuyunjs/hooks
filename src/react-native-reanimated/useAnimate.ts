import React from 'react';
import Animated, {
  clockRunning,
  useValue,
  useCode,
  cond,
  set,
  block,
  onChange,
  startClock,
  stopClock,
} from 'react-native-reanimated';
import { TRUE, FALSE, TrueOrFalse, DEFAULT_HANDLE, NOOP } from './constant';
import { useClock } from './useClock';
import { useMemoizeJSONObject } from '../useMemoizeJSONObject';

export type AnimateBaseProps<Config> = {
  position: Animated.Value<number>;
  config?: Partial<Omit<Config, 'toValue'>>;
  onStart?: () => Animated.Adaptable<any>;
  onEnd?: () => Animated.Adaptable<any>;
};

export type AnimateProps<State extends Animated.AnimationState, Config> = Omit<
  AnimateBaseProps<Config>,
  'position'
> & {
  defaultConfig: Omit<Config, 'toValue'>;
  state: State;
  animate: (
    clock: Animated.Clock,
    state: State,
    config: Config & { toValue: Animated.Value<number> },
  ) => Animated.Node<number>;
};

export const useAnimate = <State extends Animated.AnimationState, Config>({
  config,
  onEnd = DEFAULT_HANDLE,
  onStart = DEFAULT_HANDLE,
  animate,
  state,
  defaultConfig,
}: AnimateProps<State, Config>) => {
  const animating = useValue<TrueOrFalse>(FALSE);
  const toValue = useValue<number>(0);
  const clock = useClock();

  state = useMemoizeJSONObject(state);

  useCode(() => {
    const { finished, time } = state;
    return block([
      cond(clockRunning(clock), NOOP, [set(finished, FALSE), set(time, 0)]),
      cond(animating, [
        animate(
          clock,
          state,
          // @ts-ignore
          Object.assign({}, defaultConfig, config, { toValue }),
        ),
        cond(clockRunning(clock), NOOP, startClock(clock)),
        cond(finished, [set(animating, FALSE), stopClock(clock)]),
      ]),
      onChange(finished, cond(finished, onEnd(), onStart())),
    ]);
  }, [onStart, onEnd, state, defaultConfig, animate, config]);

  const start = React.useCallback(
    (to: Animated.Adaptable<number>) => {
      return block([set(animating, TRUE), set(toValue, to)]);
    },
    [animating, toValue],
  );

  const stop = React.useCallback(() => {
    return set(animating, FALSE);
  }, [animating]);

  return { start, stop };
};
