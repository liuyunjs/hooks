import React from 'react';
import { State } from 'react-native-gesture-handler';
import Animated, {
  useValue,
  useCode,
  cond,
  eq,
  set,
  block,
} from 'react-native-reanimated';
import { GestureBaseContext, useGestureBase } from './useGestureBase';
import { TRUE, NOOP, TrueOrFalse, FALSE, DEFAULT_HANDLE } from './constant';

export type GestureContext = GestureBaseContext & {
  isSwiping: Animated.Value<TrueOrFalse>;
};

export type GestureProps = {
  onStart?: (ctx: GestureContext) => Animated.Adaptable<any>;
  onActive?: (ctx: GestureContext) => Animated.Adaptable<any>;
  onEnd?: (ctx: GestureContext) => Animated.Adaptable<any>;
};

export const useGesture = ({
  onEnd = DEFAULT_HANDLE,
  onStart = DEFAULT_HANDLE,
  onActive = DEFAULT_HANDLE,
}: GestureProps) => {
  const [gestureHandler, gestureCtx] = useGestureBase();
  const isSwiping = useValue<TrueOrFalse>(FALSE);

  const ctx: GestureContext = React.useMemo(
    () => Object.assign({}, gestureCtx, { isSwiping }),
    [gestureCtx, isSwiping],
  );

  useCode(() => {
    const maybeStart = cond(ctx.isSwiping, NOOP, [
      onStart(ctx),
      set(ctx.isSwiping, TRUE),
    ]);
    return block([
      cond(
        eq(ctx.state, State.ACTIVE),
        [maybeStart, onActive(ctx)],
        cond(ctx.isSwiping, [set(ctx.isSwiping, FALSE), onEnd(ctx)]),
      ),
      cond(eq(ctx.state, State.BEGAN), maybeStart),
    ]);
  }, [onEnd, onStart, onActive, ctx]);

  return [gestureHandler, ctx] as const;
};
