import { State } from 'react-native-gesture-handler';
import Animated, {
  cond,
  eq,
  set,
  block,
  useValue,
} from 'react-native-reanimated';
import { useCodeExec } from './useCodeExec';
import { GestureBaseContext, useGestureBase } from './useGestureBase';
import { TRUE, NOOP, TrueOrFalse, FALSE, DEFAULT_HANDLE } from './constant';

export type GestureContext = GestureBaseContext & {
  isSwiping: Animated.Value<TrueOrFalse>;
  exec: ReturnType<typeof useCodeExec>;
};

export type GestureProps<T extends GestureContext> = {
  onStart?: (ctx: T) => Animated.Adaptable<any>;
  onActive?: (ctx: T) => Animated.Adaptable<any>;
  onEnd?: (ctx: T) => Animated.Adaptable<any>;
};

export const useGesture = <T extends GestureContext>({
  onEnd = DEFAULT_HANDLE,
  onStart = DEFAULT_HANDLE,
  onActive = DEFAULT_HANDLE,
}: GestureProps<T>) => {
  const gesture = useGestureBase();

  const ctx = gesture[1] as T;
  ctx.isSwiping = useValue<TrueOrFalse>(FALSE);

  ctx.exec = useCodeExec(() => {
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
  }, [onEnd, onStart, onActive]);

  return gesture as [(...args: any[]) => any, T];
};
