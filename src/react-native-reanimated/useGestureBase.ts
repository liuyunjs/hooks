import { State } from 'react-native-gesture-handler';
import Animated, { Value, event } from 'react-native-reanimated';
import useWillMount from 'react-will-mount-hook';

export type GestureBaseContext = {
  gestureX: Animated.Value<number>;
  gestureY: Animated.Value<number>;
  velocityX: Animated.Value<number>;
  velocityY: Animated.Value<number>;
  x: Animated.Value<number>;
  y: Animated.Value<number>;
  state: Animated.Value<State>;
};

const createGesture = () => {
  const gestureX = new Value<number>(0);
  const gestureY = new Value<number>(0);
  const velocityX = new Value<number>(0);
  const velocityY = new Value<number>(0);
  const x = new Value<number>(0);
  const y = new Value<number>(0);
  const state = new Value<State>(State.UNDETERMINED);

  const gestureHandler = event([
    {
      nativeEvent: {
        translationX: gestureX,
        translationY: gestureY,
        velocityX,
        velocityY,
        x,
        y,
        state,
      },
    },
  ]);

  return [
    gestureHandler,
    {
      gestureX,
      gestureY,
      state,
      velocityX,
      velocityY,
      x,
      y,
    },
  ] as const;
};

export const useGestureBase = () => useWillMount(createGesture);
