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

export type AnimateBaseProps<Config> = {
  position: Animated.Value<number>;
  config?: Partial<Omit<Config, 'toValue'>>;
  onStart?: (position: Animated.Value<number>) => Animated.Adaptable<any>;
  onEnd?: (position: Animated.Value<number>) => Animated.Adaptable<any>;
  onUpdate?: (position: Animated.Value<number>) => Animated.Adaptable<any>;
};

export type AnimateProps<State extends Animated.AnimationState, Config> = Omit<
  AnimateBaseProps<Config>,
  'position'
> & {
  defaultConfig: Omit<Config, 'toValue'>;
  position: Animated.Value<number>;
  extraValue: Animated.Value<number>;
  // state: Omit<State, 'finished' | 'time'>;
  animate: (
    clock: Animated.Clock,
    state: State,
    config: Config & { toValue: Animated.Value<number> },
  ) => Animated.Node<number>;
  getState?: (
    position: Animated.Value<number>,
    finished: Animated.Value<number>,
    time: Animated.Value<number>,
    extraValue: Animated.Value<number>,
  ) => State;
};

const defaultGetState = <State extends Animated.AnimationState>(
  position: Animated.Value<number>,
  finished: Animated.Value<number>,
  time: Animated.Value<number>,
  extraValue: Animated.Value<number>,
  // @ts-ignore
): State => ({
  position,
  finished,
  time,
  velocity: extraValue,
});

export const useAnimate_ = <State extends Animated.AnimationState, Config>({
  config,
  onEnd = DEFAULT_HANDLE,
  onStart = DEFAULT_HANDLE,
  onUpdate = DEFAULT_HANDLE,
  animate,
  defaultConfig,
  getState = defaultGetState,
  extraValue,
  position,
}: AnimateProps<State, Config>) => {
  const animating = useValue<TrueOrFalse>(FALSE);
  const toValue = useValue<number>(0);
  const clock = useClock();
  const finished = useValue<TrueOrFalse>(FALSE);
  const time = useValue<number>(0);

  // state = useMemoizeJSONObject(state, 0);

  useCode(() => {
    const state = getState(position, finished, time, extraValue);
    return block([
      cond(clockRunning(clock), NOOP, [set(finished, FALSE), set(time, 0)]),
      cond(
        animating,
        [
          animate(
            clock,
            state,
            // @ts-ignore
            Object.assign({}, defaultConfig, config, { toValue }),
          ),
          onUpdate(state.position),
          cond(clockRunning(clock), NOOP, startClock(clock)),
          cond(finished, [set(animating, FALSE), stopClock(clock)]),
        ],
        stopClock(clock),
      ),
      onChange(
        finished,
        cond(finished, onEnd(state.position), onStart(state.position)),
      ),
    ]);
  }, [onStart, onUpdate, onEnd, defaultConfig, animate, config, getState]);

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
