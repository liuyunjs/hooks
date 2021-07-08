import React from 'react';
import Animated, {
  useValue,
  block,
  set,
  add,
  multiply,
  call,
  cond,
  and,
  eq,
  neq,
  max,
  min,
  divide,
  sub,
  useCode,
  onChange,
} from 'react-native-reanimated';
import { useReactCallback } from 'react-use-callback';
import { useTimeout } from '@liuyunjs/timer/lib/react';
import { useSnap, SnapProps, SnapContext, useSnapResult } from './useSnap';
import { useSpring } from './useSpring';
import { DEFAULT_HANDLE, WIDTH } from './constant';

export type UseSwiperProps = Omit<
  SnapProps,
  'onStart' | 'onActive' | 'onEnd'
> & {
  initialIndex?: number;

  maximum?: number;
  minimum?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  onChange?: (index: number) => void;
  onChangeNative?: (index: Animated.Value<number>) => Animated.Adaptable<any>;
};

export type SwiperContext = SnapContext & {
  offset: Animated.Value<number>;
  current: Animated.Value<number>;
  index: Animated.Value<number>;
  nextIndex: Animated.Value<number>;
  setBy: (
    index: Animated.Adaptable<number>,
    animated?: boolean,
  ) => Animated.Adaptable<any>;
  start: () => void;
  stop: () => void;
  clamp: (num: Animated.Adaptable<number>) => Animated.Node<number>;
};

const useLoopControl = ({
  current,
  setBy,
  autoplay,
  autoplayInterval,
  index,
}: {
  current: Animated.Value<number>;
  index: Animated.Value<number>;
  setBy: (to: Animated.Adaptable<number>) => void;
  autoplay: boolean;
  autoplayInterval: number;
}) => {
  const timeout = useTimeout();

  const stop = React.useCallback(() => {
    timeout.clear();
  }, [timeout]);

  const start = useReactCallback(() => {
    if (!autoplay) {
      return;
    }
    timeout.set(() => {
      setBy(1);
    }, autoplayInterval);
  });

  useCode(() => {
    stop();
    if (!autoplay) {
      return;
    }

    start();

    return block([
      onChange(current, call([current], stop)),
      cond(eq(index, current), call([index], start)),
    ]);
  }, [autoplay, autoplayInterval]);

  return { start, stop };
};

const useEvents = ({
  getContext,
  stop,
  clamp,
  layout,
  start,
  velocity,
  toValue,
}: {
  getContext: (ctx: SnapContext) => SwiperContext;
  stop: () => Animated.Adaptable<any>;
  clamp: (next: Animated.Adaptable<number>) => Animated.Adaptable<any>;
  layout: number;
  start: () => Animated.Adaptable<any>;
  velocity: Animated.Value<number>;
  toValue: Animated.Value<number>;
}) => {
  const setVelocity = React.useCallback(
    (ctx: SnapContext) => {
      return set(velocity, divide(ctx.velocity, layout));
    },
    [layout, velocity],
  );

  const onStart = React.useCallback(
    (_: SnapContext) => {
      const ctx = getContext(_);

      return block([stop(), setVelocity(ctx), set(ctx.offset, ctx.current)]);
    },
    [getContext, setVelocity, stop],
  );

  const onActive = React.useCallback(
    (_: SnapContext) => {
      const ctx = getContext(_);

      return block([
        setVelocity(ctx),
        set(
          ctx.current,
          clamp(
            add(
              ctx.offset,
              multiply(divide(ctx.gesture, layout), ctx.direction),
            ),
          ),
        ),
      ]);
    },
    [clamp, getContext, layout, setVelocity],
  );

  const onEnd = React.useCallback(
    (_: SnapContext) => {
      const ctx = getContext(_);

      return block([
        setVelocity(ctx),
        set(ctx.nextIndex, clamp(sub(ctx.nextIndex, ctx.snap))),
        set(toValue, ctx.nextIndex),
        start(),
      ]);
    },
    [clamp, getContext, setVelocity, start, toValue],
  );

  return { onActive, onEnd, onStart };
};

export const useSwiper = (props: UseSwiperProps) => {
  const {
    initialIndex = 0,
    minimum = Number.MIN_SAFE_INTEGER,
    maximum = Number.MAX_SAFE_INTEGER,
    autoplay = false,
    autoplayInterval = 3000,
    onChange: onChangeProp,
    onChangeNative = DEFAULT_HANDLE,
    layout = WIDTH,
  } = props;
  const offset = useValue<number>(initialIndex);
  const current = useValue<number>(initialIndex);
  const index = useValue<number>(initialIndex);
  const nextIndex = useValue<number>(initialIndex);
  const velocity = useValue<number>(0);
  const toValue = useValue<number>(0);

  const clamp = React.useCallback(
    (num: Animated.Adaptable<number>) => {
      return min(maximum, max(minimum, num));
    },
    [maximum, minimum],
  );

  const onAnimationEnd = React.useCallback(() => {
    return cond(and(eq(current, nextIndex), neq(nextIndex, index)), [
      call([nextIndex], ([idx]) => {
        onChangeProp?.(idx);
      }),
      onChangeNative(nextIndex),
      set(index, nextIndex),
    ]);
  }, [current, nextIndex, index, onChangeProp, onChangeNative]);

  const { start: startNative, stop: stopNative } = useSpring({
    position: current,
    velocity,
    onEnd: onAnimationEnd,
    toValue,
  });

  const setBy = React.useCallback(
    (num: Animated.Adaptable<number>, animated: boolean = true) => {
      const next = clamp(add(index, num));
      if (!animated) {
        current.setValue(block([set(index, next), set(nextIndex, next)]));
        return;
      }
      nextIndex.setValue(block([set(toValue, next), startNative()]));
    },
    [clamp, current, index, nextIndex, startNative],
  );

  const { start, stop } = useLoopControl({
    current,
    index,
    autoplay,
    autoplayInterval,
    setBy,
  });

  const getContext = React.useCallback(
    (ctx: SnapContext): SwiperContext =>
      Object.assign({}, ctx, {
        offset,
        current,
        nextIndex,
        index,
        setBy,
        start,
        stop,
        clamp,
      }),
    [current, clamp, index, nextIndex, offset, setBy, start, stop],
  );

  return useSnapResult(
    useSnap(
      Object.assign(
        {},
        props,
        useEvents({
          getContext,
          stop: stopNative,
          start: startNative,
          toValue,
          velocity,
          layout,
          clamp,
        }),
      ),
    ),
    getContext,
  );
};
