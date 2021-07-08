import Animated, {
  useValue,
  cond,
  set,
  onChange,
  block,
  neq,
} from 'react-native-reanimated';
import { DEFAULT_HANDLE, FALSE, TRUE, TrueOrFalse } from './constant';
import { useCodeExec } from './useCodeExec';

export type SwitchProps = {
  onTrue?: () => Animated.Adaptable<number>;
  onFalse?: () => Animated.Adaptable<number>;
  onTrueAlways?: () => Animated.Adaptable<number>;
  onFalseAlways?: () => Animated.Adaptable<number>;
  initialSwitch?: boolean;
};

export const useSwitch = ({
  onFalse = DEFAULT_HANDLE,
  onFalseAlways = DEFAULT_HANDLE,
  onTrueAlways = DEFAULT_HANDLE,
  onTrue = DEFAULT_HANDLE,
  initialSwitch,
}: SwitchProps) => {
  const switchTrueOrFalse = useValue(+!!initialSwitch as TrueOrFalse);

  // @ts-ignore
  const exec: ReturnType<typeof useCodeExec> & {
    open: () => Animated.Node<number>;
    close: () => Animated.Node<number>;
  } = useCodeExec(() => {
    return block([
      cond(switchTrueOrFalse, onTrueAlways(), onFalseAlways()),
      onChange(switchTrueOrFalse, cond(switchTrueOrFalse, onTrue(), onFalse())),
    ]);
  }, [onTrue, onFalse, onTrueAlways, onFalseAlways]);

  const maybeSet = (next: Animated.Adaptable<number>) =>
    cond(neq(next, switchTrueOrFalse), set(switchTrueOrFalse, next));

  exec.open = () => maybeSet(TRUE);

  exec.close = () => maybeSet(FALSE);

  return exec;
};
