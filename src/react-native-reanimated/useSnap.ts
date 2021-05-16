import React from 'react';
import { I18nManager } from 'react-native';
import Animated, {
  useValue,
  cond,
  set,
  block,
  add,
  multiply,
  greaterOrEq,
  greaterThan,
  abs,
  round,
  divide,
  sub,
} from 'react-native-reanimated';
import { GestureContext, useGesture } from './useGesture';
import { useClock } from './useClock';
import { DEFAULT_HANDLE, WIDTH } from './constant';

export type SnapContext = GestureContext & {
  snap: Animated.Value<number>;
  direction: number;
  gesture: Animated.Value<number>;
  velocity: Animated.Value<number>;
};

export type SnapProps = {
  onStart?: (ctx: SnapContext) => Animated.Adaptable<any>;
  onActive?: (ctx: SnapContext) => Animated.Adaptable<any>;
  onEnd?: (ctx: SnapContext) => Animated.Adaptable<any>;
  horizontal?: boolean;
  pageEnabled?: boolean;
  swipeExtrapolatedThreshold?: number;
  swipeDistanceMinimum?: number;
  swipeVelocityImpact?: number;
  layout?: number;
};

export const useSnap = ({
  layout = WIDTH,
  onActive: onSwipeActive = DEFAULT_HANDLE,
  onStart: onSwipeStart = DEFAULT_HANDLE,
  onEnd: onSwipeEnd = DEFAULT_HANDLE,
  horizontal = true,
  swipeExtrapolatedThreshold = 0.5,
  swipeDistanceMinimum = 20,
  swipeVelocityImpact = 0.3,
  pageEnabled = true,
}: SnapProps) => {
  const snap = useValue<number>(0);
  const timestamp = useValue<number>(0);
  const clock = useClock();

  const getContext = React.useCallback(
    (ctx: GestureContext): SnapContext =>
      Object.assign({}, ctx, {
        snap,
        velocity: horizontal ? ctx.velocityX : ctx.velocityY,
        gesture: horizontal ? ctx.gestureX : ctx.gestureY,
        direction: I18nManager.isRTL && horizontal ? 1 : -1,
      }),
    [horizontal, snap],
  );

  const onStart = React.useCallback(
    (_: GestureContext) => {
      const ctx = getContext(_);
      return block([
        set(ctx.snap, 0),
        set(timestamp, clock),
        onSwipeStart(ctx),
      ]);
    },
    [clock, getContext, onSwipeStart, timestamp],
  );

  const onActive = React.useCallback(
    (_: GestureContext) => {
      const ctx = getContext(_);
      return block([set(timestamp, clock), onSwipeActive(ctx)]);
    },
    [clock, getContext, onSwipeActive, timestamp],
  );

  const onEnd = React.useCallback(
    (_: GestureContext) => {
      const ctx = getContext(_);
      const extrapolatedPosition = add(
        ctx.gesture,
        multiply(
          cond(greaterOrEq(sub(clock, timestamp), 200), 0, ctx.velocity),
          swipeVelocityImpact,
        ),
      );

      const snapDirection = cond(
        greaterThan(extrapolatedPosition, 0),
        -ctx.direction,
        ctx.direction,
      );

      return block([
        cond(
          greaterOrEq(abs(ctx.gesture), swipeDistanceMinimum),
          pageEnabled
            ? cond(
                greaterOrEq(
                  abs(extrapolatedPosition),
                  multiply(layout, swipeExtrapolatedThreshold),
                ),
                set(ctx.snap, snapDirection),
              )
            : set(
                ctx.snap,
                multiply(
                  snapDirection,
                  round(divide(abs(extrapolatedPosition), layout)),
                ),
              ),
        ),

        onSwipeEnd(ctx),
      ]);
    },
    [
      getContext,
      swipeVelocityImpact,
      timestamp,
      clock,
      swipeDistanceMinimum,
      pageEnabled,
      layout,
      swipeExtrapolatedThreshold,
      onSwipeEnd,
    ],
  );

  const offset = React.useMemo(
    () => [-swipeDistanceMinimum, swipeDistanceMinimum],
    [swipeDistanceMinimum],
  );

  return useSnapResult(
    useGesture({ onStart, onEnd, onActive }),
    getContext,
    (gestureHandler) =>
      Object.assign(
        {},
        {
          onGestureEvent: gestureHandler,
          onHandlerStateChange: gestureHandler,
        },
        horizontal
          ? { activeOffsetX: offset, failOffsetY: offset }
          : { activeOffsetY: offset, failOffsetX: offset },
      ),
  );
};

export const useSnapResult = <
  GestureHandler,
  Context,
  OriginContext,
  GestureProps = GestureHandler,
>(
  [gestureHandlerOrProps, ctxInput]: readonly [GestureHandler, OriginContext],
  getContext: (ctx: OriginContext) => Context,
  wrapper: (gestureHandlerOrProps: GestureHandler) => GestureProps = (g) =>
    g as unknown as GestureProps,
) => {
  const ctx = React.useMemo(() => getContext(ctxInput), [ctxInput, getContext]);

  return [wrapper(gestureHandlerOrProps), ctx] as const;
};
